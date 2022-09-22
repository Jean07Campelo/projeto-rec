import db from "../database/db.js";
import joi from "joi";
import dayjs from "dayjs";

const pollShema = joi.object({
  title: joi.string().required().empty(" "),
  expireAt: joi.string().empty(""),
});

async function RegisterPoll(req, res) {
  const { title, expireAt } = req.body;

  const validationPoll = pollShema.validate(req.body, { abortEarly: false });

  if (validationPoll.error) {
    const errors = validationPoll.error.details.map((detail) => detail.message);
    return res.status(422).send(errors);
  }

  //expireAt not past => add validity Thirty Days
  if (expireAt === "") {
    const validityThirtyDays = dayjs(Date.now())
      .add(30, "days")
      .format("YYYY-MM-DD HH:mm");
    await db
      .collection("polls")
      .insertOne({ title, expireAt: validityThirtyDays });
    res.status(201).send({ title, expireAt: validityThirtyDays });
    return;
  } 

  db.collection("polls").insertOne({ title, expireAt });
  res.status(201).send({ title, expireAt });
}

async function GetPolls(req, res) {
}

export { RegisterPoll, GetPolls };
