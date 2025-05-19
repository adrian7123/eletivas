import { NextFunction, Request, Response } from "express";

// Middleware para lidar com rotas não encontradas
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({ error: "Recurso não encontrado" });
};

// Middleware para lidar com erros
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error("Erro na aplicação:", err);
  res.status(500).json({ error: "Erro interno no servidor" });
};
