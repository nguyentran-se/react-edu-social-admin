import { Workspace } from 'src/@types';
import axiosClient from './axiosClient';
type SearchInParams = {
  value: string;
};
export const workspaceApis = {
  getWorkspace: () => axiosClient.get<Workspace>('/workspace'),
};
