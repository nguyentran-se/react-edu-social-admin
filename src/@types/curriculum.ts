import { Syllabus } from './syllabus';
import {Combo} from './combo'
import { Season } from './season';
export interface Major {
  id: number;
  code: string;
  name: string;
  active: boolean;
}
export interface MajorSpecialization {
  id: number;
  name: null | string;
  code: null | string;
  active: boolean;
}
export interface Specialization {
  id: number;
  code: string;
  name: string;
  major: Major;
  active: boolean;
}
export interface Curriculum {
  id: number;
  name: string;
  code: string;
  schoolYear: string;
  description: string;
  major: Major;
  specialization: Specialization;
  startedTerm: {
    season: Season;
    year: string;
  };
  noSemester: number;
  currentSemester: number;
  active: boolean;
}

export interface CurriculumSyllabus {
  syllabus: {
    id: number;
    name: string;
    code: null;
  };
  semester: number;
}
export interface CurriculumUser {
  id: number;
  code: string;
  name: string;
}

export interface CurriculumComboInList {
  curriculum: {
    id: string;
    name: string;
    code: string;
    active: false;
  };
  combos: CurriculumCombo[]
}

export interface CurriculumCombo {
  id: number;
  name: string;
  code: string;
  syllabi: Syllabus[];
  active: boolean;
}

export interface CurriculumComboDetail {
  combo:      Combo;
  curriculum: Combo;
  comboPlans: ComboPlan[];
}

export interface ComboPlan {
  syllabus:  Combo;
  semester:  number;
  comboPlan: boolean;
}