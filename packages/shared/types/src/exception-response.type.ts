export interface ExceptionResponse {
  statusCode: number;
  errorCode: string;
  path: string;
  stack?: unknown;
}
