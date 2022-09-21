import express from "express";
import cors from "cors";

import dotenv from "dotenv";
dotenv.config();

const server = express();
server.use(cors());
server.use(express.json());
const port = 5000;

server.listen(port, () => console.log(`Listening on port ${port}`));
