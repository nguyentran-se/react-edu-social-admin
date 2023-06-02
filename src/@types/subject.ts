export interface Subject {
  id:       number;
  name:     null | string;
  code:     null | string;
  subjects: Subject[] | null;
  active:   boolean;
  combo:    boolean;
}

export interface SubjectSyllabus {
  id:       number;
  name:     null | string;
  code:     null | string;
  active:   boolean;
}
