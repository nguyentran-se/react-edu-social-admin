import { Curriculum } from 'src/@types';
export const curriculumData: Curriculum[] = [
  {
    id: 1,
    name: 'test',
    code: 'ABC',
    schoolYear: 'K15',
    description: 'Curriculum 1',
    major: {
      id: 1,
      code: 'IT',
      name: 'Information Technology',
      active: true,
    },
    specialization: {
      id: 1,
      name: 'Software Engineering',
      code: 'SE',
      major: {
        id: 1,
        code: 'IT',
        name: 'Information Technology',
        active: true,
      },
      active: true,
    },
    startedTerm: null,
    noSemester: 9,
    currentSemester: 0,
    active: true,
  },
];
