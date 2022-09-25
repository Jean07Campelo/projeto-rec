import db from "../database/db.js";
import joi from "joi";
import dayjs from "dayjs";

const pollShema = joi.object({
  title: joi.string().required().empty(" "),
  expireAt: joi.string().empty(""),
});

async function RegisterPoll(req, res) {
  const { expireAt } = req.body;
  const titlePassed = req.body.title
  const title = titlePassed[0].toUpperCase() + titlePassed.substring(1);

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
    const pollWithExpireAt = await db.collection("polls").findOne({ title })
    res.status(201).send(pollWithExpireAt);
    return;
  }

  await db.collection("polls").insertOne({ title, expireAt });

  const registerPoll = await db.collection("polls").findOne({ title });

  res.status(201).send(registerPoll);
}

async function GetPolls(req, res) {
  const pollsRegistered = await db.collection("polls").find().toArray();
  res.status(200).send(pollsRegistered);
}

export { RegisterPoll, GetPolls };
