export interface Error {
  data: {
    error: string;
    message: string;
    displayMessage?: string;
    code?: string;
    statusCode: number;
  };
  status: number;
}

/**
 * Get display message from error response
 * Prefers displayMessage, falls back to message
 */
export function getErrorMessage(error: Error | unknown, fallback: string): string {
  const err = error as Error;
  return err?.data?.displayMessage ?? err?.data?.message ?? fallback;
}
