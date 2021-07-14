import {User} from './user';

export interface HandleFeedback {
  id?: number;
  feedbackId: number;
  content: string;
  image?: string;
  user: User;
}
