
export type Subject = 'Maths' | 'English' | 'Hindi' | 'Science' | 'Grammar' | 'Physics' | 'Chemistry' | 'Biology' | 'SST' | 'Computer' | 'Retail' | 'Revision' | 'Misc';

export interface StudyTask {
  id: string;
  date: string;
  subject: Subject;
  description: string;
  completed: boolean;
  phase: 1 | 2;
}

export interface DayPlan {
  date: string;
  tasks: StudyTask[];
  isRevisionDay?: boolean;
}

export interface UserStats {
  totalTasks: number;
  completedTasks: number;
  streak: number;
}
