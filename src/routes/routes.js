import express from "express";

import * as pollController from "../controllers/poll.controller.js";
import * as choiceController from "../controllers/choice.controller.js";

const router = express.Router();

router.post("/poll", pollController.RegisterPoll);
router.get("/poll", pollController.GetPolls);

router.post("/choice", choiceController.RegisterOption);

export default router;