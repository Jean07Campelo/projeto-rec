import db from "../database/db.js";
import joi from "joi";
import { ObjectId } from "mongodb";
import dayjs from "dayjs";
import compareTime from "dayjs/plugin/isSameOrBefore.js";

const isSameOrBefore = compareTime;
dayjs.extend(isSameOrBefore);

const choiceSchema = joi.object({
  title: joi.string().required().empty(" "),
  pollId: joi.string().required().empty(" "),
});

async function RegisterOption(req, res) {
  const { pollId } = req.body;
  const titlePassed = req.body.title
  const title = titlePassed[0].toUpperCase() + titlePassed.substring(1);
  
  const validationChoice = choiceSchema.validate(req.body, {
    abortEarly: false,
  });

  if (validationChoice.error) {
    const errors = validationChoice.error.details.map(
      (detail) => detail.message
    );
    return res.status(422).send(errors);
  }

  //validation poll existing by _id
  try {
    const pollExisting = await db
      .collection("polls")
      .findOne({ _id: ObjectId(pollId) });

    if (!pollExisting) {
      return res.status(400).send("pollId is not existing");
    }

    //validate validation date
    const timeNow = dayjs(Date.now()).format("YYYY-MM-DD HH:mm");
    const pollExpired = dayjs(pollExisting.expireAt).isSameOrBefore(
      dayjs(timeNow)
    );

    if (pollExpired) {
      return res
        .status(403)
        .send(`Poll selected expired in ${pollExisting.expireAt}`);
    }
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }

  //register new choice
  try {
    //validate title
    const titleIsRegistered = await db.collection("choices").findOne({ title });
    if (titleIsRegistered) {
      return res
        .status(409)
        .send(`The title "${titleIsRegistered.title}" is registered`);
    }

    await db.collection("choices").insertOne({ title, pollId: ObjectId(pollId) });
    const choiceRegistered = await db.collection("choices").findOne({ title });

    res.status(201).send(choiceRegistered);

  } catch (error) {
    return res.status(500).send({ message: error.message });
  }

  
}

async function GetChoicesByPoll(req, res) {
  const pollId = req.params.id;

  try {
    const pollExisting = await db
      .collection("polls")
      .findOne({ _id: ObjectId(pollId) });

    if (!pollExisting) {
      res
        .status(404)
        .send(`The id "${pollId}" is not registered with a valid poll`);
    }

    const choicesRegistered = await db
      .collection("choices")
      .find({ pollId: ObjectId(pollId) })
      .toArray();

      if (choicesRegistered.length === 0) {
        return res
          .status(200)
          .send(`Do not have choices registered for "${pollExisting.title}"`);
      }
    res.status(200).send(choicesRegistered);
  } catch (error) {
    res.send(error.message);
  }

}

export { RegisterOption, GetChoicesByPoll };
