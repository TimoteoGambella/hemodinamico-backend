import { Response, Request } from 'express'
import archiver from 'archiver'
import path from 'path'

export default function exportLogs(_req: Request, res: Response) {
  // Creamos un objeto de tipo archiver
  const archive = archiver('zip', {
    zlib: { level: 9 }, // Establecemos el nivel de compresión.
  })

  // Este evento se dispara si hay un error en el proceso de compresión.
  archive.on('error', function (err) {
    res.status(500).send({ error: err.message })
  })

  // Establecemos el tipo de respuesta
  res.attachment('log.zip')

  // Establecemos el directorio que queremos comprimir
  archive.directory(
    path.join(process.cwd(), process.env.LOG_FOLDER_NAME || 'logs'),
    false
  )

  // Enviamos el archivo comprimido al cliente
  archive.pipe(res)
  archive.finalize()
}
