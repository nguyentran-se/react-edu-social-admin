import { fakePromise } from 'src/utils';
import axiosClient from './axiosClient';
import { Specialization } from 'src/@types';

export const specializationApis = {
  getSpecializations: () => axiosClient.get<Specialization[]>('/specialization'),
  getSpecialization: (id: string) => axiosClient.get<Specialization>(`/specialization/${id}`),
  updateSpecialization: (newSpecialization) =>
    axiosClient.put('/specialization', newSpecialization),
  createSpecialization: (newSpecialization) =>
    axiosClient.post('/specialization', newSpecialization),
  deleteSpecialization: (id) => axiosClient.delete(`/specialization/${id}`),
};
