import db from "../database/db.js";
import { ObjectId } from "mongodb";
import dayjs from "dayjs";

async function RegisterNewVote(req, res) {
  const choiceId = req.params.id;

  try {
    const pollSelected = await db
      .collection("choices")
      .findOne({ _id: ObjectId(choiceId) });

    if (!pollSelected) {
      return res.status(404).send(`Choice with id "${choiceId}" is invalid`);
    }
  } catch (error) {
    return res.status(500).send(error.message);
  }

  res.sendStatus(201);
}

export { RegisterNewVote };
