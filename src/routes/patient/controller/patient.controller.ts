import { Request, Response, NextFunction } from 'express'
import PatientDAO from '../../../db/dao/Patient.dao'
import StretcherDAO from '../../../db/dao/Stretcher.dao'

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
        res.status(409).json({ message: `Paciente con DNI ${patient.dni} ya registrado.` })
        return
      }

      if (!patient.stretcherId) {
        let stretcher = await new StretcherDAO().getOneFreeStretcher()
        if (!stretcher) {
          stretcher = await new StretcherDAO().create({} as Stretcher)
          if (!stretcher) throw new Error('Error al crear camilla.')
        }
        patient.stretcherId = stretcher._id
      }

      const createdPatient = await new PatientDAO().create(patient)
      if (!createdPatient) throw new Error('Error al crear paciente.')

      if (createdPatient.stretcherId) {
        const updatedStretcher = await new StretcherDAO().update(
          String(createdPatient.stretcherId),
          {
            patientId: createdPatient._id,
          } as Stretcher
        )
        if (!updatedStretcher) throw new Error('Error al actualizar camilla.')
      }

      res.status(201).json({
        message: 'Paciente creado exitosamente.',
        data: createdPatient,
      })
    } catch (error) {
      next(error)
    }
  },
  delete: async (req: Request, res: Response, next: NextFunction) => {
    const { dni } = req.query
    try {
      if (!dni) {
        res.status(400).json({ message: 'DNI no proporcionado.' })
        return
      }
      const patient = await new PatientDAO().getByDNI(Number(dni))
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
