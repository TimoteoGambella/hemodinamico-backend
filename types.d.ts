interface User {
  username: string
  password: string
  name: string
  lastName: string
  isAdmin: boolean
  isValidPassword: (password: string) => boolean
}
