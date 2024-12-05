import { AxiosError } from 'axios';

export class APIErrorHandler {
  static handle(error: unknown): Error {
    if (this.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message;
      return new Error(`API Error: ${message}`);
    }
    return error as Error;
  }

  private static isAxiosError(error: unknown): error is AxiosError {
    return (error as AxiosError).isAxiosError === true;
  }
}