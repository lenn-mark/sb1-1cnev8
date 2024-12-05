import { Request, Response, NextFunction } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ZodError } from 'zod';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(error);

  if (error instanceof PrismaClientKnownRequestError) {
    return res.status(400).json({
      error: 'Database Error',
      message: error.message
    });
  }

  if (error instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation Error',
      message: error.errors
    });
  }

  return res.status(500).json({
    error: 'Internal Server Error',
    message: error.message
  });
};