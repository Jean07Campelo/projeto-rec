import db from "../database/db.js";
import joi from "joi";
import { ObjectId } from "mongodb";

const choiceSchema = joi.object({
  title: joi.string().required().empty(" "),
  pollId: joi.string().required().empty(" "),
});

async function RegisterOption(req, res) {
  const { title, pollId } = req.body;

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
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }

  res.sendStatus(201);
}

export { RegisterOption };
