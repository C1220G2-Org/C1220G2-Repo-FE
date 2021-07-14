import {MeetingRoom} from './meeting-room';
import {MeetingType} from './meeting-type';
import {User} from './user';

export interface BookingRoom {
  id: number;
  content: string;
  registrationDate: string;
  startDate: string;
  endDate: string;
  meetingRoom: MeetingRoom;
  meetingType: MeetingType;
  user: User;
  status: number
}
