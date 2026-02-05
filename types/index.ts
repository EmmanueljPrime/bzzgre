export type Participant = {
  id: number;
  name: string;
  drinks: string[];
  assignedDrink: string | null;
};

export type Config = {
  numberOfPeople: number;
  drinksPerPerson: number;
};

export type AppState = {
  config: Config;
  participants: Participant[];
  isSetupComplete: boolean;
  isDrawingComplete: boolean;
};

export const initialAppState: AppState = {
  config: {
    numberOfPeople: 0,
    drinksPerPerson: 0,
  },
  participants: [],
  isSetupComplete: false,
  isDrawingComplete: false,
};
