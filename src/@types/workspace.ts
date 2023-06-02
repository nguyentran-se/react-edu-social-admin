import { CurrentTerm } from './common';

export interface Workspace {
  id: number;
  name: string;
  code: string;
  currentTerm: CurrentTerm;
  foundedYear: number;
  slotDurationInMin: number;
  restTimeInMin: number;
  domain: string;
  morningStartTime: string;
  morningEndTime: string;
  afternoonStartTime: string;
  afternoonEndTime: string;
  emailSuffix: string;
}
