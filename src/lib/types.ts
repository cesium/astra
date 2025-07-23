export enum UserType {
  student,
  admin,
  professor,
}

export interface User {
  id: string;
  name: string;
  email: string;
}
