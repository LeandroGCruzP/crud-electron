import { Request, Response } from "express"
import { UpdateUserService } from "../services/UpdateUserService"

class UpdateUserController {
  async handle(request: Request, response: Response) {
    const { id } = request.params
    const {
      username,
      password,
    } = request.body

    const service = new UpdateUserService()

    const user = await service.execute(
      id,
      {
        username,
        password,
      }
    )

    return response.json(user)

  }
}

export { UpdateUserController };
