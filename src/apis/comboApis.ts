import { subjectData } from 'src/__mock__';
import { fakePromise } from 'src/utils';
import axiosClient from './axiosClient';
import { Combo, ComboDetail } from 'src/@types';

export const comboApis = {
  getCombos: () => axiosClient.get<Combo[]>('/combo'),
  getCombo: (comboId) => axiosClient.get<ComboDetail>(`/combo/${comboId}`),
  updateCombo: (newCombo) => axiosClient.put('/combo', newCombo),
  createCombo: (newCombo) => axiosClient.post('/combo', newCombo),
  deleteCombo: (id) => axiosClient.delete(`/combo/${id}`),
};
