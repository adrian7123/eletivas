import express from "express";
import { CardController } from "../controllers/card.controller";

const indexRouter = express.Router();

indexRouter.get("/cards", CardController.get);

export { indexRouter };

