import bcrypt from 'bcrypt'

export default function comparePassword(password: string, hashedPassword: string): boolean {
  return bcrypt.compareSync(password, hashedPassword)
}
