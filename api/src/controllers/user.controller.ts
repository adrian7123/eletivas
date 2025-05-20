import { Request, Response } from 'express';

export class UserController {
  static async login(req: Request, res: Response): Promise<any> {
    try {
      const { name } = req.body;

      if (name === process.env.AUTH_HASH_SECRET) {
        return res.status(200).json({ name: 'Mayara', admin: true });
      }

      return res.status(200).json({ name, admin: false });
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return res.status(500).json({ message: 'Erro ao fazer login' });
    }
  }
}
