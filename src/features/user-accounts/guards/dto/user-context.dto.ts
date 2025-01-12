export class UserContextDto {
  id: string;
}

export type Nullable<T> = { [P in keyof T]: T[P] | null };
//type Nullable<UserContextDto> = { id: string | null }
