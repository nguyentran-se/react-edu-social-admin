import { syllabusData } from 'src/__mock__';
import { fakePromise } from 'src/utils';
import axiosClient from './axiosClient';
import { Syllabus } from 'src/@types';
import { SyllabusBody } from 'src/pages/Syllabus/SyllabusForm';
export const syllabusApis = {
  getSyllabuses: () => axiosClient.get<Syllabus[]>(`/syllabus`),
  getSyllabus: (id: string) => axiosClient.get<Syllabus>(`/syllabus/${id}`),
  createSyllabus: (newSyllabus: SyllabusBody) => axiosClient.post('/syllabus', newSyllabus),
  updateSyllabus: (newSyllabus: SyllabusBody) => axiosClient.put(`/syllabus`, newSyllabus),
  deleteSyllabus: (id: number) => axiosClient.delete(`/syllabus/${id}`),
};
