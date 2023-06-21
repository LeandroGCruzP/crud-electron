import { Router } from "express"
import { CreateUserController } from "./controllers/CreateUserController"
import { ListUserController } from "./controllers/ListUserController"
import { UpdateUserController } from "./controllers/UpdateUserController"

const router = Router()

router.get("/users", new ListUserController().handle)
router.post("/users", new CreateUserController().handle)
router.put("/users/:id", new UpdateUserController().handle)

export { router }
