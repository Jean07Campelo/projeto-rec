import db from "../database/db.js";
import { ObjectId } from "mongodb";

async function GetResultByPollId(req, res) {
  const pollId = req.params.id;

  try {
    const pollSeleted = await db
      .collection("polls")
      .findOne({ _id: ObjectId(pollId) });

    if (!pollSeleted) {
      return res
        .status(404)
        .send(`Don't exist poll registered with id: ${pollId}`);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }

  res.sendStatus(200);
}

export { GetResultByPollId };
