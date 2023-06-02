import { subjectData } from 'src/__mock__';
import { fakePromise } from 'src/utils';
import axiosClient from './axiosClient';
import { Subject, SubjectSyllabus } from 'src/@types';

export const subjectApis = {
  getSubjects: () => axiosClient.get<Subject[]>('/subject'),
  getSubject: (subjectId) => axiosClient.get<Subject>(`/subject/${subjectId}`),
  updateSubject: (newSubject) => axiosClient.put('/subject', newSubject),
  createSubject: (newSubject) => axiosClient.post('/subject', newSubject),
  deleteSubject: (subjectId) => axiosClient.delete(`/subject/${subjectId}`),
  //syllabus
  getSubjectSyllabi: (subjectId) =>
    axiosClient.get<SubjectSyllabus[]>(`/subject/${subjectId}/syllabus`),
};
