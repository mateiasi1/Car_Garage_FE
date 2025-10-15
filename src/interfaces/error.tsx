export interface Error {
  data: {
    error: string;
    message: string;
    statusCode: number;
  };
  status: number;
}
