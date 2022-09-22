import db from "../database/db.js";
import joi from "joi";

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

  res.sendStatus(201);
}

export { RegisterOption };
