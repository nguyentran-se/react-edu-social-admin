import { Curriculum, User, UserRole } from 'src/@types';

const generateCurriculum = (): Curriculum => {
  return {
    id: Math.floor(Math.random() * 100),
    name: null,
    code: `CUR-${Math.floor(Math.random() * 1000)}`,
    schoolYear: null,
    description: null,
    major: null,
    specialization: null,
    startedTerm: null,
    noSemester: Math.floor(Math.random() * 10) + 1,
    currentSemester: Math.floor(Math.random() * 10) + 1,
    active: Math.random() < 0.5,
  };
};

const generateUser = (): User => {
  return {
    id: Math.floor(Math.random() * 100),
    name: `User ${Math.floor(Math.random() * 100)}`,
    code: `USR-${Math.floor(Math.random() * 1000)}`,
    role: UserRole.Student,
    schoolYear: '2022',
    personalMail: `user${Math.floor(Math.random() * 100)}@example.com`,
    eduMail: `edu${Math.floor(Math.random() * 100)}@example.com`,
    avatar: 'https://example.com/avatar.png',
    phoneNumber: `+1 555-555-${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0')}`,
    curriculum: generateCurriculum(),
    active: Math.random() < 0.5,
    identifyNumber: '123',
    groupAdmin: false,
  };
};

export const userData: User[] = Array.from({ length: 3 }, generateUser);
