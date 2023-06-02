import { Curriculum } from "./curriculum";
import { Syllabus } from "./syllabus";

type Nullabel<T, K extends keyof T> = Omit<T, K> & { [P in K]: null };
export enum GroupType {
  Class      = 'CLASS', 
  Course     = 'COURSE',
  Department = 'DEPARTMENT', 
  Normal     = 'NORMAL',
}
export interface ClassGroup extends Nullabel<Group, 'syllabus' | 'teacher'> {
  type: GroupType.Class;
}
export interface CourseGroup extends Group {
  type: GroupType.Course;
}
export interface DepartmentGroup extends Nullabel<Group, 'curriculum' | 'syllabus' | 'teacher'> {
  type: GroupType.Department;
}
// TODO: define 
export interface NormalGroup {
  type: GroupType.Normal;
}
export interface Group {
  id:              number;
  name:            string;
  type:            GroupType;
  conversationId:  string | null;
  createdDateTime: Date | string;
  curriculum:      Curriculum;
  syllabus:        Syllabus;
  teacher:         Teacher;
  private:         boolean;
  active:          boolean;
  publish:         boolean;
}

export interface PrepareGroup extends Group {
  referenceClass:  Group | null;
}

export interface Teacher {
  id:           number;
  name:         string;
  code:         null;
  role:         string;
  schoolYear:   null;
  personalMail: null;
  eduMail:      null;
  avatar:       null;
  phoneNumber:  null;
  curriculum:   null;
  active:       boolean;
}

export interface GroupUser {
  id:         number;
  name:       string;
  code:       string;
  eduMail:    string;
  groupAdmin: boolean;
  active:     boolean;
}

export interface GroupSlot {
  id:        number;
  no:        number;
  order:     number;
  dayOfWeek: number;
  room:      string;
  date:      null;
}

export interface CreateSlotPayload {
  order:     number;
  dayOfWeek: number;
  room:      string;
}

export interface ClassSlot {
  groupId: number;
  startDate: string;
  slots: {
    order: number;
    dayOfWeek: number;
    room: string;
  }[];
}