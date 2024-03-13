import PatientModel from '../../../db/model/Patient.model'
import { Request, Response, NextFunction } from 'express'
import StretcherDAO from '../../../db/dao/Stretcher.dao'
import { ReqSession } from '../../../../module-types'
import PatientDAO from '../../../db/dao/Patient.dao'
import { ObjectId } from 'mongoose'

async function handlerStretcher(patient: Patient, createdBy: string) {
  if (patient.stretcherId === 'auto') {
    let stretcher = await new StretcherDAO().getOneFreeStretcher()
    if (!stretcher) {
      stretcher = await new StretcherDAO().create({} as Stretcher, createdBy)
      if (!stretcher) throw new Error('Error al crear camilla.')
    }
    patient.stretcherId = stretcher._id
  } else return
}

async function handlerUpdateStretcher(
  createdPatient: Patient,
  editedBy: string,
  oldPatient?: Patient
) {
  if (createdPatient.stretcherId) {
    const updatedStretcher = await new StretcherDAO().update(
      String(createdPatient.stretcherId),
      {
        patientId: createdPatient._id,
      } as Stretcher,
      editedBy
    )
    if (!updatedStretcher) throw new Error('Error al actualizar camilla.')
  }
  if (oldPatient && oldPatient.stretcherId) {
    const updatedStretcher = await new StretcherDAO().update(
      String(oldPatient.stretcherId),
      {
        patientId: null,
      } as Stretcher,
      editedBy
    )
    if (!updatedStretcher) throw new Error('Error al actualizar camilla.')
  }
}

export default {
  getAll: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const patients = await new PatientDAO().getAll()
      if (!patients) throw new Error('Error al obtener pacientes.')
      res.status(200).json({ message: 'Get all patients', data: patients })
    } catch (error) {
      next(error)
    }
  },
  register: async (request: Request, res: Response, next: NextFunction) => {
    const req = request as ReqSession
    const patient: Patient = req.body
    try {
      const existPatient = await new PatientDAO().getByDNI(patient.dni)
      if (existPatient) {
        res
          .status(409)
          .json({ message: `Paciente con DNI ${patient.dni} ya registrado.` })
        return
      }

      await handlerStretcher(patient, req.session.user!._id)

      const error = new PatientModel(patient).validateSync()
      if (error) {
        res.status(400).json({ message: error.message })
        return
      }

      const createdPatient = await new PatientDAO().create(
        patient,
        req.session.user?._id as unknown as ObjectId
      )
      if (!createdPatient) throw new Error('Error al crear paciente.')

      await handlerUpdateStretcher(createdPatient, req.session.user!._id)

      res.status(201).json({
        message: 'Paciente creado exitosamente.',
        data: createdPatient,
      })
    } catch (error) {
      next(error)
    }
  },
  update: async (request: Request, res: Response, next: NextFunction) => {
    const req = request as ReqSession
    const { id } = req.params
    const tmPatient = req.body as Patient
    try {
      if (!tmPatient || Object.keys(tmPatient).length === 0) {
        res.status(400).json({
          message: 'No se ha proporcionado la información del paciente.',
        })
        return
      }
      const exists = await new PatientDAO().getById(id as unknown as ObjectId)
      if (!exists) {
        res.status(404).json({ message: 'Paciente no encontrado.' })
        return
      }
      await handlerStretcher(tmPatient, req.session.user!._id)
      const patient = { ...exists, ...tmPatient }
      const error = new PatientModel(patient).validateSync()
      if (error) {
        res.status(400).json({ message: error.message })
        return
      }
      const updatedPatient = await new PatientDAO().update(
        id,
        patient,
        req.session.user?._id as unknown as ObjectId
      )
      if (!updatedPatient) throw new Error('Error al actualizar paciente.')
      if (tmPatient.stretcherId !== String(exists.stretcherId))
        await handlerUpdateStretcher(
          updatedPatient,
          req.session.user!._id,
          exists
        )
      res.status(200).json({
        message: 'Paciente actualizado exitosamente.',
        data: updatedPatient,
      })
    } catch (error) {
      next(error)
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
      const patient = await new PatientDAO().getById(id as unknown as ObjectId)
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
