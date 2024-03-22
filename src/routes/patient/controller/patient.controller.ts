import PatientModel, { PatientDocument } from '../../../db/model/Patient.model'
import { Request, Response, NextFunction } from 'express'
import StretcherDAO from '../../../db/dao/Stretcher.dao'
import { ReqSession } from '../../../../module-types'
import PatientDAO from '../../../db/dao/Patient.dao'
import { ObjectId, startSession } from 'mongoose'
import { ObjectId as ObjId } from 'mongodb'

export default {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    const { populate } = req.query
    try {
      const patients = await new PatientDAO().getAll(populate === 'true')
      if (!patients) throw new Error('Error al obtener pacientes.')
      res.status(200).json({ message: 'Get all patients', data: patients })
    } catch (error) {
      next(error)
    }
  },
  register: async (request: Request, res: Response, next: NextFunction) => {
    const req = request as ReqSession
    const patient: Patient = req.body
    const session = await startSession()
    session.startTransaction()
    try {
      const existPatient = await new PatientDAO().getByDNI(patient.dni)
      if (existPatient) {
        res
          .status(409)
          .json({ message: `Paciente con DNI ${patient.dni} ya registrado.` })
        return
      }

      /* CREAMOS UN NUEVO ID */
      const newObjId = new ObjId()
      /* CONSERVAMOS EL ID DE LA CAMA DEL BODY */
      const tmp = patient.stretcherId
      /* ASIGNAMOS EL ID NUEVO SOLO PARA VALIDAR EL BODY */
      patient.stretcherId = tmp === 'auto' ? newObjId : tmp
      /* VALIDAMOS EL BODY */
      const error = new PatientModel(patient).validateSync()
      if (error) {
        res.status(400).json({ message: error.message })
        return
      }
      /* ASIGNAMOS EL ID ORIGINAL DEL BODY */
      patient.stretcherId = tmp

      if (patient.stretcherId === 'auto') {
        /* COMPROBAR CAMAS LIBRES */
        let stretcher = await new StretcherDAO(session).getOneFreeStretcher()
        if (stretcher) {
          /* CREAR PACIENTE PASANDOLE LA CAMA LIBRE */
          const createdPatient = await new PatientDAO(session).create(
            { ...patient, stretcherId: stretcher._id },
            req.session.user?._id as unknown as ObjectId
          )
          if (!createdPatient) throw new Error('Error al crear paciente.')
          /* ACTUALIZAR CAMA LIBRE */
          const updatedStretcher = await new StretcherDAO(session).update(
            String(stretcher._id),
            {
              patientId: createdPatient._id,
            } as Stretcher,
            req.session.user!._id
          )
          if (!updatedStretcher) throw new Error('Error al actualizar cama.')
          /* COMMIT */
          await session.commitTransaction()
          res.status(201).json({
            message: 'Paciente creado exitosamente.',
            data: createdPatient,
          })
          return
        } else {
          /* CREAR PACIENTE CON ID DE CAMA NO EXISTENTE */
          const createdPatient = await new PatientDAO(session).create(
            { ...patient, stretcherId: newObjId },
            req.session.user?._id as unknown as ObjectId
          )
          if (!createdPatient) throw new Error('Error al crear paciente.')
          /* CREAR CAMA CON ID NO EXISTENTE */
          stretcher = await new StretcherDAO(session).create(
            {
              _id: newObjId,
              patientId: createdPatient,
            } as unknown as Stretcher,
            req.session.user!._id
          )
          if (!stretcher) throw new Error('Error al crear camilla.')
          /* COMMIT */
          await session.commitTransaction()
          res.status(201).json({
            message: 'Paciente creado exitosamente.',
            data: createdPatient,
          })
          return
        }
      }

      if (patient.stretcherId === null) {
        /* CREAR PACIENTE SIN CAMA */
        const createdPatient = await new PatientDAO(session).create(
          patient,
          req.session.user?._id as unknown as ObjectId
        )
        if (!createdPatient) throw new Error('Error al crear paciente.')
        /* COMMIT */
        await session.commitTransaction()
        res.status(201).json({
          message: 'Paciente creado exitosamente.',
          data: createdPatient,
        })
        return
      }

      if (ObjId.isValid(patient.stretcherId as string)) {
        /* COMPROBAR EXISTENCIA */
        const stretcherExist = await new StretcherDAO().getById(
          patient.stretcherId as string
        )
        if (!stretcherExist) {
          res.status(404).json({ message: 'Cama no encontrada.' })
          return
        }
        /* CREAR PACIENTE */
        const createdPatient = await new PatientDAO(session).create(
          { ...patient, stretcherId: stretcherExist._id },
          req.session.user?._id as unknown as ObjectId
        )
        if (!createdPatient) throw new Error('Error al crear paciente.')
        /* ACTUALIZAR CAMA */
        const updatedStretcher = await new StretcherDAO(session).update(
          String(stretcherExist._id),
          {
            patientId: createdPatient._id,
          } as Stretcher,
          req.session.user!._id
        )
        if (!updatedStretcher) throw new Error('Error al actualizar cama.')
        /* COMMIT */
        await session.commitTransaction()
        res.status(201).json({
          message: 'Paciente creado exitosamente.',
          data: createdPatient,
        })
      } else {
        res.status(400).json({ message: 'Id de camilla inválido.' })
        return
      }
    } catch (error) {
      await session.abortTransaction()
      next(error)
    } finally {
      session.endSession()
    }
  },
  update: async (request: Request, res: Response, next: NextFunction) => {
    const req = request as ReqSession
    const { id } = req.params
    const tmPatient = req.body as Patient & {
      stretcherId: 'auto' | null | string
    }
    const session = await startSession()
    session.startTransaction()
    try {
      // POR ALGUNA RAZON SI NO SE HACE ESTO, NO SE PUEDE HACER EL COMMIT MAS ADELANTE
      // await session.commitTransaction()

      if (!tmPatient || Object.keys(tmPatient).length === 0) {
        res.status(400).json({
          message: 'No se ha proporcionado la información del paciente.',
        })
        return
      } else if (!tmPatient.stretcherId && tmPatient.stretcherId !== null) {
        res.status(400).json({ message: 'Id de cama no proporcionado.' })
        return
      }

      const existPatient = await new PatientDAO().getById(id)
      if (!existPatient) {
        res.status(404).json({ message: 'Paciente no encontrado.' })
        return
      }

      const handleUpdate = async (patient: Patient) => {
        /* VALIDACION DE ESQUEMA */
        const error = new PatientModel(patient).validateSync()
        if (error) throw new Error(error.message)
        /* ACTUALIZAR PACIENTE */
        const updatedPatient = await new PatientDAO(session).update(
          id,
          patient,
          req.session.user?._id as unknown as ObjectId
        )
        if (!updatedPatient) throw new Error('Error al actualizar paciente.')
        return updatedPatient
      }

      if (
        (existPatient.stretcherId as string)?.toString() !==
        tmPatient.stretcherId
      ) {
        /**
         * FALTA MANEJAR SI ES NULL O 'AUTO'
         */
        if (tmPatient.stretcherId === 'auto') {
          if (existPatient.stretcherId) {
            /* JUNTAMOS LOS OBJETOS */
            const patient = { ...existPatient, ...tmPatient }
            /**
             * COMO EL PACIENTE ACTUAL YA TIENE UNA CAMA ASIGNADA
             * Y SE QUIERE CAMBIAR A 'AUTO', SE DEBE SOLO ESE CAMBIO
             * POR LO QUE DESPUES DE JUNTAR LOS OBJETOS, SE DEBE
             * REASIGNAR EL ID DE LA CAMA
             */
            patient.stretcherId = existPatient.stretcherId as string
            /* ACTUALIZAMOS CON LOS NUEVOS DATOS DEL PACIENTE */
            const updatedPatient = await handleUpdate(patient)
            if (!updatedPatient) {
              await session.abortTransaction()
              res.status(500).json({ message: 'Error al actualizar paciente.' })
              return
            }
            /* COMMIT */
            await session.commitTransaction()
            res.status(200).json({
              message: 'Paciente actualizado exitosamente.',
              data: updatedPatient,
            })
            return
          } else {
            const freeStretcher = await new StretcherDAO(
              session
            ).getOneFreeStretcher()
            if (freeStretcher) {
              const patient = { ...existPatient, ...tmPatient }
              patient.stretcherId = freeStretcher._id

              const updatedPatient = await handleUpdate(patient)
              if (!updatedPatient) {
                await session.abortTransaction()
                res
                  .status(500)
                  .json({ message: 'Error al actualizar paciente.' })
                return
              }

              const updatedStretcher = await new StretcherDAO(session).update(
                String(freeStretcher._id),
                {
                  patientId: updatedPatient._id,
                } as Stretcher,
                req.session.user!._id
              )
              if (!updatedStretcher) {
                await session.abortTransaction()
                res.status(500).json({ message: 'Error al actualizar cama.' })
                return
              }

              await session.commitTransaction()
              res.status(200).json({
                message: 'Paciente actualizado exitosamente.',
                data: updatedPatient,
              })
              return
            } else {
              const newId = new ObjId()
              const patient = { ...existPatient, ...tmPatient }
              patient.stretcherId = newId.toString()

              const updatedPatient = await handleUpdate(patient)
              if (!updatedPatient) {
                await session.abortTransaction()
                res
                  .status(500)
                  .json({ message: 'Error al actualizar paciente.' })
                return
              }

              const stretcher = await new StretcherDAO(session).create(
                {
                  _id: newId,
                  patientId: existPatient._id,
                } as unknown as Stretcher,
                req.session.user!._id
              )
              if (!stretcher) {
                await session.abortTransaction()
                res.status(500).json({ message: 'Error al crear camilla.' })
                return
              }

              await session.commitTransaction()
              res.status(200).json({
                message: 'Paciente actualizado exitosamente.',
                data: updatedPatient,
              })
              return
            }
          }
        } else if (tmPatient.stretcherId === null) {
          const patient = { ...existPatient, ...tmPatient }
          const updatedPatient = await handleUpdate(patient)
          if (!updatedPatient) {
            await session.abortTransaction()
            res.status(500).json({ message: 'Error al actualizar paciente.' })
            return
          }

          const deletedStretcher = await new StretcherDAO(session).delete(
            String(existPatient.stretcherId),
            req.session.user!._id
          )
          if (!deletedStretcher) {
            await session.abortTransaction()
            res.status(500).json({ message: 'Error al eliminar la camilla.' })
            return
          }

          await session.commitTransaction()
          res.status(200).json({
            message: 'Paciente actualizado exitosamente.',
            data: updatedPatient,
          })
          return
        } else {
          if (!ObjId.isValid(tmPatient.stretcherId as string)) {
            res.status(400).json({ message: 'Id de cama inválido.' })
            return
          }
          const stretcher = await new StretcherDAO().getById(
            tmPatient.stretcherId as string
          )

          if (!stretcher || stretcher.isDeleted) {
            res.status(404).json({ message: 'Cama no encontrada.' })
            return
          } else if (stretcher.patientId) {
            res.status(409).json({ message: 'Cama ocupada.' })
            return
          }

          const patient = { ...existPatient, ...tmPatient }
          const updatedPatient = await handleUpdate(patient)

          if (!updatedPatient) {
            await session.abortTransaction()
            res.status(500).json({ message: 'Error al actualizar paciente.' })
            return
          }

          const updatedStretcher = await new StretcherDAO(session).update(
            String(stretcher._id),
            {
              patientId: updatedPatient._id,
            } as Stretcher,
            req.session.user!._id
          )
          if (!updatedStretcher) {
            await session.abortTransaction()
            res.status(500).json({ message: 'Error al actualizar cama.' })
            return
          }

          /**
           * NO PUEDE EXISTIR UNA CAMA SIN UN PACIENTE ASIGNADO
           * POR LO QUE SE ELIMINA LA CAMA
           */
          if (existPatient.stretcherId) {
            const deletedStretcher = await new StretcherDAO(session).delete(
              String(existPatient.stretcherId),
              req.session.user!._id
            )
            if (!deletedStretcher) {
              await session.abortTransaction()
              res.status(500).json({ message: 'Error al eliminar la camilla.' })
              return
            }
          }

          await session.commitTransaction()
          res.status(200).json({
            message: 'Paciente actualizado exitosamente.',
            data: updatedPatient,
          })
          return
        }
      } else {
        const patient = { ...existPatient, ...tmPatient }
        /* ACTUALIZAMOS CON LOS NUEVOS DATOS DEL PACIENTE */
        const updatedPatient = await handleUpdate(patient)
        if (!updatedPatient) {
          await session.abortTransaction()
          res.status(500).json({ message: 'Error al actualizar paciente.' })
          return
        }
        /* COMMIT */
        await session.commitTransaction()
        res.status(200).json({
          message: 'Paciente actualizado exitosamente.',
          data: updatedPatient,
        })
        return
      }
    } catch (error) {
      await session.abortTransaction()
      next(error)
    } finally {
      session.endSession()
    }
  },
  delete: async (request: Request, res: Response, next: NextFunction) => {
    const req = request as ReqSession
    const { id } = req.params
    try {
      if (!id) {
        res.status(400).json({ message: 'DNI no proporcionado.' })
        return
      }
      const patient = (await new PatientDAO().getById(id)) as PatientDocument
      if (!patient) {
        res.status(404).json({ message: 'Paciente no encontrado.' })
        return
      } else if (patient.laboratoryId) {
        res.status(409).json({
          message:
            'El paciente que intenta eliminar tiene un laboratorio asignado. Primero debe eliminar el laboratorio.',
        })
        return
      } else if (patient.stretcherId) {
        res.status(409).json({
          message:
            'El paciente que intenta eliminar tiene una cama asignada. Primero debe eliminar la cama.',
        })
        return
      }
      const deletedPatient = await new PatientDAO().delete(
        patient._id,
        req.session.user?._id as unknown as ObjectId
      )
      if (!deletedPatient) throw new Error('Error al eliminar paciente.')
      if (deletedPatient.stretcherId) {
        await new StretcherDAO().update(
          String(deletedPatient.stretcherId),
          {
            patientId: null,
          } as Stretcher,
          req.session.user!._id
        )
      }
      res.status(200).json({
        message: 'Paciente eliminado exitosamente.',
        data: deletedPatient,
      })
    } catch (error) {
      next(error)
    }
  },
}
