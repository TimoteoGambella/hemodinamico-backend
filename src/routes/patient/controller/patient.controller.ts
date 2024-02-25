import { Request, Response, NextFunction } from 'express'
import PatientDAO from '../../../db/dao/Patient.dao'
import StretcherDAO from '../../../db/dao/Stretcher.dao'
import { ObjectId } from 'mongoose'
import PatientModel from '../../../db/model/Patient.model'

async function handlerStretcher(patient: Patient) {
  if (patient.stretcherId === 'auto') {
    let stretcher = await new StretcherDAO().getOneFreeStretcher()
    if (!stretcher) {
      stretcher = await new StretcherDAO().create({} as Stretcher)
      if (!stretcher) throw new Error('Error al crear camilla.')
    }
    patient.stretcherId = stretcher._id
  } else return
}

async function handlerUpdateStretcher(createdPatient: Patient, oldPatient?: Patient){
  if (createdPatient.stretcherId) {
    const updatedStretcher = await new StretcherDAO().update(
      String(createdPatient.stretcherId),
      {
        patientId: createdPatient._id,
      } as Stretcher
    )
    if (!updatedStretcher) throw new Error('Error al actualizar camilla.')
  } if (oldPatient && oldPatient.stretcherId) {
    const updatedStretcher = await new StretcherDAO().update(
      String(oldPatient.stretcherId),
      {
        patientId: null,
      } as Stretcher
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
  register: async (req: Request, res: Response, next: NextFunction) => {
    const patient: Patient = req.body
    try {
      const existPatient = await new PatientDAO().getByDNI(patient.dni)
      if (existPatient) {
        res
          .status(409)
          .json({ message: `Paciente con DNI ${patient.dni} ya registrado.` })
        return
      }

      await handlerStretcher(patient)

      const error = new PatientModel(patient).validateSync()
      if (error) {
        res.status(400).json({ message: error.message })
        return
      }

      const createdPatient = await new PatientDAO().create(patient)
      if (!createdPatient) throw new Error('Error al crear paciente.')

      await handlerUpdateStretcher(createdPatient)

      res.status(201).json({
        message: 'Paciente creado exitosamente.',
        data: createdPatient,
      })
    } catch (error) {
      next(error)
    }
  },
  update: async (req: Request, res: Response, next: NextFunction) => {
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
      await handlerStretcher(tmPatient)
      const patient = { ...exists, ...tmPatient }
      const error = new PatientModel(patient).validateSync()
      if (error) {
        res.status(400).json({ message: error.message })
        return
      }
      const updatedPatient = await new PatientDAO().update(id, patient)
      if (!updatedPatient) throw new Error('Error al actualizar paciente.')
      await handlerUpdateStretcher(updatedPatient, exists)
      res.status(200).json({
        message: 'Paciente actualizado exitosamente.',
        data: updatedPatient,
      })
    } catch (error) {
      next(error)
    }
  },
  delete: async (req: Request, res: Response, next: NextFunction) => {
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
      }
      const deletedPatient = await new PatientDAO().delete(patient as Patient)
      if (!deletedPatient) throw new Error('Error al eliminar paciente.')
      if (deletedPatient.stretcherId) {
        await new StretcherDAO().update(String(deletedPatient.stretcherId), {
          patientId: null,
        } as Stretcher)
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
