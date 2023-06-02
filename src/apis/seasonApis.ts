import axiosClient from './axiosClient';
import { Season, CreateSeasonPayload } from 'src/@types';

export const seasonApis = {
  getSeasons: () => axiosClient.get<Season[]>('/season'),
  getSeason: (seasonId) => axiosClient.get<Season>(`/season/${seasonId}`),
  // updateSeason: (newSeason) => axiosClient.put('/season', newSeason),
  createSeason: (newSeason: CreateSeasonPayload) => axiosClient.post('/season', newSeason),
  deleteSeason: (seasonId) => axiosClient.delete(`/season/${seasonId}`),
  //syllabus
  updateSeason: (newSeason: CreateSeasonPayload) => axiosClient.put('/season', newSeason),

  createWorkspaceSeason: (seasons: { season: CreateSeasonPayload[] }) =>
    axiosClient.post('/workspace/season', seasons),
};
