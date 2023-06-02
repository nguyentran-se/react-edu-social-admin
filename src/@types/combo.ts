import { Syllabus } from "./syllabus";

export interface Combo {
  id: number;
  name: string;
  code: string;
  active: boolean;
}

export interface ComboDetail extends Combo {
  syllabi: Syllabus[]
}