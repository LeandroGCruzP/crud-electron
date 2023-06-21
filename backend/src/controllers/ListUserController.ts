import { Request, Response } from "express"
import { ListUserService } from "../services/ListUserService"

class ListUserController {
  async handle(request: Request, response: Response) {
    const service = new ListUserService()

    const users = await service.execute()

    return response.json(users)
  }
}

export { ListUserController }
