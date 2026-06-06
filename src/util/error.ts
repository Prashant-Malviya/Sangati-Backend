import { Response } from "express";

interface ErrorMessage extends Error {
  status?: number;
}

export const TryError = (message: string, status: number = 500) => {
  const error: ErrorMessage = new Error(message);

  error.status = status;

  return error;
};

export const CatchError = (
  error: unknown,
  res: Response,
  prodMessage: string = "internal server error",
) => {
  if (error instanceof Error) {
    const message =
      process.env.NODE_ENV === "dev" ? error.message : prodMessage;
    const status = (error as ErrorMessage).status || 500;
    res?.status(status).json({ message: message });
  }
};
