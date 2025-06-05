export interface UserDetails {
  username: string;
  registrationDate: number;
}

export interface Session {
  id: number;
  user: string;
  therapist: string;
  timestamp: number;
  completed: boolean;
}

export type SessionResponse = [
  number,    // id
  string,    // user
  string,    // therapist
  number,    // timestamp
  boolean,   // completed
];

export type UserResponse = [
  string,    // username
  number,    // registrationDate
];
