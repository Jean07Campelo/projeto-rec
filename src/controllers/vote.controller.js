import db from "../database/db.js";
import { ObjectId } from "mongodb";
import dayjs from "dayjs";
import compareTime from "dayjs/plugin/isSameOrBefore.js";

const isSameOrBefore = compareTime;
dayjs.extend(isSameOrBefore);

async function RegisterNewVote(req, res) {
  const choiceId = req.params.id;

  try {
    //search choice by id
    const choiceSelected = await db
      .collection("choices")
      .findOne({ _id: ObjectId(choiceId) });

    if (!choiceSelected) {
      return res.status(404).send(`Choice with id "${choiceId}" is invalid`);
    }

    const pollSelected = await db
      .collection("polls")
      .findOne({ _id: ObjectId(choiceSelected.pollId) });

    const timeNow = dayjs(Date.now()).format("YYYY-MM-DD HH:mm");
    const pollExpired = dayjs(pollSelected.expireAt).isSameOrBefore(
      dayjs(timeNow)
    );

    if (pollExpired) {
      return res
        .status(403)
        .send(
          `The poll selected "${pollSelected.title}" expired in ${pollSelected.expireAt}`
        );
    }

    //register new vote
    const newVote = { createdAt: timeNow, choiceId: ObjectId(choiceId) };
    db.collection("votes").insertOne(newVote);
  } catch (error) {
    return res.status(500).send(error.message);
  }

  res.sendStatus(201);
}

export { RegisterNewVote };
