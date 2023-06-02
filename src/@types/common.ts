import { Dispatch } from 'react';
import { Control } from 'react-hook-form';
import { Season } from './season';
export type SelectOption = { label: string; value: number | string };

export type Callback = (...args: any[]) => void;
export type ModalAction =
  | {
      type: 'open';
      payload: {
        content: React.FC;
        title: string;
        saveTitle?: string;
      };
      onCreateOrSave: Callback;
    }
  | {
      type: 'close';
    }
  | {
      type: 'clear';
    }
  | {
      type: 'open_confirm';
      payload: {
        content: React.FC;
        title?: string;
        confirmTitle?: string;
      };
      onConfirm: Callback;
    };

export interface ModalContextValue {
  dispatch: Dispatch<ModalAction>;
  open: boolean;
  content: React.FC;
  title: string;
  confirmTitle?: string;
  saveTitle?: string;
  onConfirm: Callback;
  onCreateOrSave: Callback;
  submitLoading: boolean;
}

export interface SelectProps {
  control: Control<any, any>;
  fieldName: string;
  options: any;
  error: boolean;
  required: boolean;
  isDisabled?: boolean;
  // classNames?: string;
  size?: 'small' | 'default';
  label?: string;
}
export const Semester = {
  Spring: 'Spring',
  Summer: 'Summer',
  Fall: 'Fall',
};

export interface WorkspaceDetail {
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
export interface UpdateWorkspacePayload {
  id: number;
  name: string;
  code: string;
  currentTerm: {
    season: { id: string };
    startDate: string;
  };
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

export interface CurrentTerm {
  id: number;
  season: Season;
  year: string;
  startDate: Date;
  endDate: null;
  state: string;
}
