export interface Property {
  id?: number;
  name: string;
  detail: string;
  price: string;
  amount: string;
  usingProperty?: number;
  maintenance?: string;
  availability?: number;
  image: string[];
  propertyMeetingRoomDto?: any[];
}
