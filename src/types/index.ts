export interface User {
  id: string;
  email: string;
  createdAt: string;
}
export type Goal =
  | "lose_weight"
  | "gain_muscle"
  | "maintain_weight"
  | "improve_endurance"
  | "increase_strength"
  | "body_recomposition";

export type Experience = "beginner" | "intermediate" | "advanced";

export type Equipment =
  | "bodyweight"
  | "dumbbell"
  | "barbell"
  | "machine"
  | "full_gym";

export type WorkoutSplit =
  | "full_body"
  | "upper_lower"
  | "push_pull_legs"
  | "bro_split"
  | "custom";

export interface UserProfile {
  userId: string;
  goal: Goal;
  experience: Experience;
  daysPerWeek: number;
  sessionLength: number;
  equipment: Equipment;
  injuries?: string;
  preferredSplit: WorkoutSplit;
  updatedAt: string;
}
export interface PlanOverview {
  goal: string;
  frequency: string;
  split: string;
  notes: string;
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  rpe: number;
  notes?: string;
  alternatives?: string[];
}

export interface DaySchedule {
  day: string;
  focus: string;
  exercises: Exercise[];
}

export interface TrainingPlan {
  id: string;
  userId: string;
  overview: PlanOverview;
  weeklySchedule: DaySchedule[];
  progression: string;
  version: number;
  createdAt: string;
}
