import express from "express";

import * as pollController from "../controllers/poll.controller.js";
import * as choiceController from "../controllers/choice.controller.js";
import * as voteController from "../controllers/vote.controller.js";
import * as resultController from "../controllers/result.controller.js";

const router = express.Router();

router.post("/poll", pollController.RegisterPoll);
router.get("/poll", pollController.GetPolls);

router.post("/choice", choiceController.RegisterOption);

router.get("/poll/:id/choice", choiceController.GetChoicesByPoll);

router.post("/choice/:id/vote", voteController.RegisterNewVote);

router.get("/poll/:id/result", resultController.GetResultByPollId);

export default router;