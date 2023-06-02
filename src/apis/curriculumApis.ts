import { fakePromise } from 'src/utils';
import axiosClient from './axiosClient';
import {
  Curriculum,
  CurriculumSyllabus,
  CurriculumCombo,
  CurriculumComboInList,
  CurriculumComboDetail,
} from 'src/@types';
import { curriculumData } from 'src/__mock__';

export const curriculumApis = {
  getCurriculums: () => axiosClient.get('/curriculum'),
  // getCurriculums: () => fakePromise(curriculumData),
  getCurriculum: (currId) => axiosClient.get<Curriculum>(`/curriculum/${currId}`),
  updateCurriculum: (newCurriculum) => axiosClient.put('/curriculum', newCurriculum),
  createCurriculum: (newCurriculum) => axiosClient.post('/curriculum', newCurriculum),
  deleteCurriculum: (currId) => axiosClient.delete(`/curriculum/${currId}`),
  // syllabus
  getCurriculumSyllabuses: (currId) =>
    axiosClient.get<CurriculumSyllabus[]>(`/curriculum/${currId}/syllabus`),
  updateCurriculumSyllabus: (currId, newCurriculumSyllabus) =>
    axiosClient.put(`/curriculum/${currId}/syllabus`, newCurriculumSyllabus),
  createCurriculumSyllabus: (currId, newCurriculumSyllabus) =>
    axiosClient.post(`/curriculum/${currId}/syllabus`, newCurriculumSyllabus),
  deleteCurriculumSyllabus: (currId, curriculumSyllabusId) =>
    axiosClient.delete(`/curriculum/${currId}/syllabus/${curriculumSyllabusId}`),
  // user
  getCurriculumUsers: (currId) => axiosClient.get(`/curriculum/${currId}/students`),
  addCurriculumUsers: (currId, userIds: number[]) =>
    axiosClient.post(`/curriculum/${currId}/students`, userIds),
  removeCurriculumUser: (currId, users: number[]) =>
    axiosClient.delete(`/curriculum/${currId}/students`, {
      data: users,
    }),
  // combo
  getCurriculumCombos: (currId) =>
    axiosClient.get<CurriculumComboInList>(`/curriculum/${currId}/combos`),
  getCurriculumCombo: (currId, comboId) =>
    axiosClient.get<CurriculumComboDetail>(`/curriculum/${currId}/combos/${comboId}`),
  updateCurriculumCombo: (currId, newCurriculumCombo) =>
    axiosClient.put(`/curriculum/${currId}/combos`, newCurriculumCombo),
  createCurriculumCombo: (currId, newCurriculumCombo) =>
    axiosClient.post(`/curriculum/${currId}/combos`, newCurriculumCombo),
  deleteCurriculumCombo: (currId, curriculumComboId) =>
    axiosClient.delete(`/curriculum/${currId}/combos/${curriculumComboId}`),
};
