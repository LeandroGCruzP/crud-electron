import prismaClient from "../prisma"

class ListUserService {
  async execute() {
    const list = prismaClient.user.findMany()

    return list
  }
}

export { ListUserService }
