export interface CreateInspectorDTO {
  firstName: string;
  lastName: string;
  password: string;
  branchId: string;
  canSendSms?: boolean;
}

export interface UpdateInspectorDTO {
  id: string;
  firstName: string;
  lastName: string;
  branchId?: string;
  canSendSms?: boolean;
}
