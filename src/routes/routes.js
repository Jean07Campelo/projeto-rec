import express from "express";

import * as pollController from "../controllers/poll.controller.js";

const router = express.Router();

router.post("/poll", pollController.RegisterPoll);