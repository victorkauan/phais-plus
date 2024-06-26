import { Router } from "express";
import { GetStatusesController } from "../modules/get-statuses/get-statuses.controller";
import { GetPrioritiesController } from "../modules/get-priorities/get-priorities.controller";
import { GetRequestsController } from "../modules/get-requests/get-requests.controller";
import { GetRequestController } from "../modules/get-request/get-request.controller";
import { UpdateRequestController } from "../modules/update-request/update-request.controller";
import { CreateRequestController } from "../modules/create-request/create-request.controller";

const router = Router();

router.get("/status", new GetStatusesController().handle);
router.get("/priority", new GetPrioritiesController().handle);

router.get("/", new GetRequestsController().handle);
router.get("/:id", new GetRequestController().handle);
router.patch("/:id", new UpdateRequestController().handle);
router.post("/", new CreateRequestController().handle);

export { router };
