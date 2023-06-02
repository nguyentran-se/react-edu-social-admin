import { Season } from './season';

export enum SeasonEnum {
  Spring = 'SPRING',
  Summer = 'SUMMER',
  Fall = 'FALL',
}
export enum TermState {
  READY = 'READY',
  PENDING = 'PENDING',
}
export interface Term {
  id: number;
  season: Season;
  year: string;
  startDate: string;
  endDate: string;
  state: TermState;
}

export enum WeekDay {
  Monday = 1,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
  Sunday,
}
