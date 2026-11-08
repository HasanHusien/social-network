class AppError extends Error {
  status: string;
  statusCode: number;
  isOperational: boolean;

  // optional
  code?: number; // 11000
  path?: string;
  value?: unknown;
  keyValue?: Record<string, unknown>;
  errors?: Record<string, { message: string }>;

  constructor(message: string, statusCode: number) {
    super(message);

    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export { AppError };

// export interface AppError extends Error {
//   status: string;
//   statusCode: number;
//   isOperational: boolean;
// }

// export function createAppError(message: string, statusCode: number): AppError {
//   const error = new Error(message) as AppError;

//   error.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
//   error.statusCode = statusCode;
//   error.isOperational = true;

//   Error.captureStackTrace(error, createAppError);

//   return error;
// }
