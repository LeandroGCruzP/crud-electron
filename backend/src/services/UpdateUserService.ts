import prismaClient from "../prisma"

type UpdateUserProps = {
  username: string
  password: string
}

class UpdateUserService {
  async execute(user_id: string, { username, password }: UpdateUserProps) {
    const user = prismaClient.user.update({
      where: {
        id: user_id
      },
      data: {
        username,
        password,
      }
    })

    return user
  }
}

export { UpdateUserService }
