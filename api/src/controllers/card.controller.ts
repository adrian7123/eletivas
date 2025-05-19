import { Request, Response } from "express";
import Card from "../models/card";

export class CardController {
  static async get(req: Request, res: Response): Promise<any> {
    try {
      const cards = await Card.find();
      return res.json(cards);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao buscar cartões" });
    }
  }
}
