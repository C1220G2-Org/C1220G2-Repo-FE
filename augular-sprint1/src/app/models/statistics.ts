import {User} from './user';

export interface Statistics {
  id?: number;
  user: User;
  startTime: string;
  endTime: string;
  startDate: string;
  endDate: string;
  status: string;
}
