import {PropertyDto} from './property-dto';
import {Property} from './property';

export interface MeetingRoom {
  id?: number;
  name: string;
  floor: number;
  capacity: number;
  color: string;
  status: string;
  propertyDtoList: PropertyDto[];
  images: string[];
  amountUse: number;
  ratings: Property[];
}
