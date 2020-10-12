import {User} from './user';
import {Biling} from './biling';

export interface Rooms {
  id: number;
  eventName: string;
  maxNoPeople: number;
  startTime: number;
  endTime: number;
  eventDate: Date;
  imageUrl: string;
  description: string;
  price: number;
  sharableLink: string;
  user: User;
  currency: number;
  subscribers: Subscribers[];
  billing: Biling;
}

export interface Subscribers {
  userId:	number;
  eventId:	number;
  subscriptionDate:	string;
  eventPrice: number;
}


