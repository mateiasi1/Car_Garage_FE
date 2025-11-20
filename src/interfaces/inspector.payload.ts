export interface CreateInspectorDTO {
  firstName: string;
  lastName: string;
  password: string;
  branchIds: string[];
}

export interface UpdateInspectorDTO {
  id: string;
  firstName: string;
  lastName: string;
  branchIds: string[];
}
