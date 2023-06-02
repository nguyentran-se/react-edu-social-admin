export interface Season {
  id:            number;
  name:          string;
  ordinalNumber: number;
  startMonth:    number;
  endMonth:      number;
  active:        boolean;
}

export interface CreateSeasonPayload {
  name:          string;
  ordinalNumber: number;
  startMonth:    number;
  endMonth:      number;
}