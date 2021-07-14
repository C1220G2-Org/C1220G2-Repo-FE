import {User} from './user';


export interface CountBookingsPerMonth {
  id: number;
  count: number;
  user: User;
  monthYear: string;

}
