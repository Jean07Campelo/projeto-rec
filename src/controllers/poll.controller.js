import db from "../database/db.js";
import joi from "joi";

const pollShema = joi.object({
  title: joi.string().required().empty(),
  expireAt: joi.string().required(),
});

async function RegisterPoll(req, res) {
  const { title, expireAt } = req.body;

  const validationPoll = pollShema.validate(req.body, { abortEarly: false });

  if (validationPoll.error) {
    const errors = validationPoll.error.details.map((detail) => detail.message);
    return res.status(422).send(errors);
  }

  res.sendStatus(201);
}

export { RegisterPoll };
