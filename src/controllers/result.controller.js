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

  try {
    const registeredChoices = await db
      .collection("choices")
      .find({ pollId: ObjectId(pollId) })
      .toArray();

    //save id from all choices registered
    const choicesId = registeredChoices.map((item) => (item._id).toString());

    const votes = await db.collection("votes").find().toArray();
    const votesId = votes.map((item) => (item.choiceId).toString())
      
    //calculates choice most voted
    let mostVotedQuantity = 0;
    let choiceMostVoted = "";
      choicesId.forEach(counterVotes);
      function counterVotes(choice) {
        let count = 0;
        for (let i = 0; i < votesId.length; i++) {
          if (choice === votesId[i]) {
            count++;
          }
        }
        if (count >= mostVotedQuantity) {
          mostVotedQuantity = count;
          choiceMostVoted = choice;
        }
      }

  } catch (error) {
    res.status(500).send(error.message);
  }

  res.sendStatus(200);
}

export { GetResultByPollId };
