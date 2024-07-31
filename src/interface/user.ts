export interface IUser {
  created_at: Date;
  email: string;
  image_url: string;
  nickname: string;
}

export interface IUserSchema {
  id: number;
  email: string;
  password: string;
  nickname: string;
  image_url: string | null;
  created_at: Date;
  updated_at: Date | null;
  deleted_at: Date | null;
  access_token: string | null;
  refresh_token: string | null;
}
