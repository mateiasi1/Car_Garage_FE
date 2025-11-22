export interface UnsubscribeRequest {
  token: string;
}

export interface UnsubscribeResponse {
  success: boolean;
  message: string;
  alreadyUnsubscribed: boolean;
}
