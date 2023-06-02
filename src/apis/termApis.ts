import { Group, PrepareGroup, Term, WorkspaceDetail, UpdateWorkspacePayload } from 'src/@types';
import axiosClient from './axiosClient';
export const termApis = {
  getTerms: () => axiosClient.get<Term[]>(`/workspace/term`),
  getTerm: (id: string) => axiosClient.get<Term>(`/workspace/term/${id}`),
  startNewSemester: () => axiosClient.get(`/term/start-new`),
  createTerm: (newTerm) => axiosClient.post('/workspace/term', newTerm),
  updateTerm: (newTerm) => axiosClient.put(`/workspace/term/${newTerm.id}`, newTerm),
  deleteTerm: (id: number) => axiosClient.delete(`/workspace/term/${id}`),
  createTermStartDate: (body: { startDate: string }) => axiosClient.post('/term/startdate', body),
  getGroups: () => axiosClient.get<PrepareGroup[]>('/term/prepare-group'),

  getWorkspaceDetail: () => axiosClient.get<WorkspaceDetail>('/workspace'),
  updateWorkspace: (data: UpdateWorkspacePayload) =>
    axiosClient.put<WorkspaceDetail>('/workspace', data),
};
