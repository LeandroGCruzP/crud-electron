import prismaClient from "../prisma"

type CreateUserProps = {
  username: string
  password: string
}

class CreateUserService {
  async execute({ username, password }: CreateUserProps) {
    const user = prismaClient.user.create({
      data: {
        username,
        password,
      }
    })

    return user
  }
}

export { CreateUserService }
