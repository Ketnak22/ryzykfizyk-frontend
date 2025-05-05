export interface User {
  id: string;
  username: string;
  ready: boolean;
}

export interface Question {
  question: string;
  answer: number;
  unit: string;
}
