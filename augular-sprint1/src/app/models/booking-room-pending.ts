import {MeetingRoom} from './meeting-room';
import {MeetingType} from './meeting-type';
import {User} from './user';

export interface bookingRoomPending {
  id: number;
  content: string;
  registrationDate: string;
  startDate: string;
  endDate: string;
  meetingRoom: MeetingRoom;
  meetingType: MeetingType;
  user: User;
  code: string;
  status: number;
}
