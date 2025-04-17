export interface UserData {
  user_id: number;
  creation_date: string;
  username: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  password_hash: string;
  session_token?: string;
  token_expiry?: string;
  profile_image?: string;
  institution: string;
  campus: string;
  student_code?: string;
  student_carreer: string;
  email: string;
  phone: string;
}

export interface CreateUser {
  username: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  password: string;
  institution: string;
  campus: string;
  student_carreer: string;
  email: string;
  phone: string;
  year: string;
  months: string;
  days: string;
}

export interface ContactUser {
  name_contact: string;
  email_contact: string;
  subject_contact: string;
  message_contact: string;

}
