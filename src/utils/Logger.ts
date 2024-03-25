import fs from 'fs'
import path from 'path'

export default class Logger {
  private static instance: Logger
  private path = path.join(process.cwd(), process.env.LOG_FOLDER_NAME || 'logs')

  constructor() {
    if (Logger.instance) return Logger.instance

    Logger.instance = this
  }

  public log(message: string) {
    if (!fs.existsSync(this.path)) fs.mkdirSync(this.path)

    const filename = `${Date.now()}.log`
    const filepath = path.join(this.path, filename)
    fs.writeFile(filepath, message, (err) => {
      if (err) {
        console.error(err)
      } else {
        console.info(
          '\x1b[34m' +
            `[INFO] Error logged with filename: ${filename}` +
            '\x1b[0m'
        )
      }
    })
  }
}
