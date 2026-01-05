
import { DayPlan, Subject, StudyTask } from './types.ts';

const generateId = () => Math.random().toString(36).substr(2, 9);

export const INITIAL_SCHEDULE: DayPlan[] = [
  {
    date: '6 JAN',
    tasks: [
      { id: generateId(), date: '6 JAN', subject: 'Maths', description: 'Ch 2 Polynomials (concept + examples)', completed: false, phase: 1 },
      { id: generateId(), date: '6 JAN', subject: 'English', description: 'Ch 8 Kathmandu (summary + keywords)', completed: false, phase: 1 },
      { id: generateId(), date: '6 JAN', subject: 'Hindi', description: 'गद्य पाठ–2', completed: false, phase: 1 },
    ]
  },
  {
    date: '7 JAN',
    tasks: [
      { id: generateId(), date: '7 JAN', subject: 'Maths', description: 'Polynomials (numericals)', completed: false, phase: 1 },
      { id: generateId(), date: '7 JAN', subject: 'Science', description: 'Ch 1 Matter in Our Surroundings', completed: false, phase: 1 },
      { id: generateId(), date: '7 JAN', subject: 'Grammar', description: 'English Editing Practice', completed: false, phase: 1 },
    ]
  },
  {
    date: '8 JAN',
    tasks: [
      { id: generateId(), date: '8 JAN', subject: 'Maths', description: 'Ch 3 Factorization (methods)', completed: false, phase: 1 },
      { id: generateId(), date: '8 JAN', subject: 'Biology', description: 'Ch 1 Improvement in Food Resources', completed: false, phase: 1 },
      { id: generateId(), date: '8 JAN', subject: 'Hindi', description: 'पाठ–3', completed: false, phase: 1 },
    ]
  },
  {
    date: '9 JAN',
    tasks: [
      { id: generateId(), date: '9 JAN', subject: 'Maths', description: 'Factorization (questions)', completed: false, phase: 1 },
      { id: generateId(), date: '9 JAN', subject: 'Physics', description: 'Ch 4 Floatation', completed: false, phase: 1 },
      { id: generateId(), date: '9 JAN', subject: 'English', description: 'Writing: Diary Entry', completed: false, phase: 1 },
    ]
  },
  {
    date: '10 JAN',
    tasks: [
      { id: generateId(), date: '10 JAN', subject: 'Maths', description: 'Ch 10 Quadrilaterals (Ex 10A)', completed: false, phase: 1 },
      { id: generateId(), date: '10 JAN', subject: 'Chemistry', description: 'Ch 2 Is Matter Around Us Pure', completed: false, phase: 1 },
      { id: generateId(), date: '10 JAN', subject: 'Hindi', description: 'पाठ–4', completed: false, phase: 1 },
    ]
  },
  {
    date: '11 JAN',
    tasks: [
      { id: generateId(), date: '11 JAN', subject: 'Maths', description: 'Ch 12 Circles', completed: false, phase: 1 },
      { id: generateId(), date: '11 JAN', subject: 'Biology', description: 'Ch 2 Cell', completed: false, phase: 1 },
      { id: generateId(), date: '11 JAN', subject: 'English', description: 'Poem – On Killing a Tree', completed: false, phase: 1 },
    ]
  },
  {
    date: '12 JAN',
    tasks: [
      { id: generateId(), date: '12 JAN', subject: 'Maths', description: 'Circles (numericals)', completed: false, phase: 1 },
      { id: generateId(), date: '12 JAN', subject: 'Physics', description: 'Work, Power & Energy (concept)', completed: false, phase: 1 },
      { id: generateId(), date: '12 JAN', subject: 'Grammar', description: 'Transformation of sentences', completed: false, phase: 1 },
    ]
  },
  {
    date: '13 JAN',
    tasks: [
      { id: generateId(), date: '13 JAN', subject: 'Maths', description: 'Ch 14 Area of Triangle & Quad', completed: false, phase: 1 },
      { id: generateId(), date: '13 JAN', subject: 'SST', description: 'Ch 1 Natural Vegetation', completed: false, phase: 1 },
      { id: generateId(), date: '13 JAN', subject: 'Hindi', description: 'पाठ–5', completed: false, phase: 1 },
    ]
  },
  {
    date: '14 JAN',
    tasks: [
      { id: generateId(), date: '14 JAN', subject: 'Maths', description: 'Ch 15 Volume & Surface Area', completed: false, phase: 1 },
      { id: generateId(), date: '14 JAN', subject: 'Chemistry', description: 'Ch 3 Atoms & Molecules', completed: false, phase: 1 },
      { id: generateId(), date: '14 JAN', subject: 'English', description: 'Writing: Informal Letter', completed: false, phase: 1 },
    ]
  },
  {
    date: '15 JAN',
    tasks: [
      { id: generateId(), date: '15 JAN', subject: 'Maths', description: 'Surface Area numericals', completed: false, phase: 1 },
      { id: generateId(), date: '15 JAN', subject: 'Biology', description: 'Ch 3 Tissues', completed: false, phase: 1 },
      { id: generateId(), date: '15 JAN', subject: 'Hindi', description: 'पाठ–6', completed: false, phase: 1 },
    ]
  },
  {
    date: '16 JAN',
    tasks: [
      { id: generateId(), date: '16 JAN', subject: 'Maths', description: 'Ch 18 Mean, Median, Mode', completed: false, phase: 1 },
      { id: generateId(), date: '16 JAN', subject: 'SST', description: 'Ch 2 French Revolution', completed: false, phase: 1 },
      { id: generateId(), date: '16 JAN', subject: 'English', description: 'Ch 9 If I Were You', completed: false, phase: 1 },
    ]
  },
  {
    date: '17 JAN',
    tasks: [
      { id: generateId(), date: '17 JAN', subject: 'Maths', description: 'Ch 19 Probability', completed: false, phase: 1 },
      { id: generateId(), date: '17 JAN', subject: 'Physics', description: 'Numericals (Work & Energy)', completed: false, phase: 1 },
      { id: generateId(), date: '17 JAN', subject: 'Grammar', description: 'Fill in the blanks', completed: false, phase: 1 },
    ]
  },
  {
    date: '18 JAN',
    tasks: [
      { id: generateId(), date: '18 JAN', subject: 'Computer', description: 'IT-ITeS Industry', completed: false, phase: 1 },
      { id: generateId(), date: '18 JAN', subject: 'Retail', description: 'Entrepreneurial Skills', completed: false, phase: 1 },
      { id: generateId(), date: '18 JAN', subject: 'Hindi', description: 'पाठ–7', completed: false, phase: 1 },
    ]
  },
  {
    date: '19 JAN',
    tasks: [
      { id: generateId(), date: '19 JAN', subject: 'Computer', description: 'Electronic Spreadsheet', completed: false, phase: 1 },
      { id: generateId(), date: '19 JAN', subject: 'English', description: 'The Beggar', completed: false, phase: 1 },
      { id: generateId(), date: '19 JAN', subject: 'SST', description: 'Ch 4 Democratic Rights', completed: false, phase: 1 },
    ]
  },
  {
    date: '20 JAN',
    isRevisionDay: true,
    tasks: [
      { id: generateId(), date: '20 JAN', subject: 'Maths', description: 'Polynomials + Factorization', completed: false, phase: 1 },
      { id: generateId(), date: '20 JAN', subject: 'Science', description: 'Chem Ch 1–2', completed: false, phase: 1 },
      { id: generateId(), date: '20 JAN', subject: 'English', description: 'Writing practice', completed: false, phase: 1 },
    ]
  },
  {
    date: '21 JAN - 4 FEB',
    tasks: [
      { id: generateId(), date: 'Phase 2', subject: 'Misc', description: 'Daily 1 subject revision', completed: false, phase: 2 },
      { id: generateId(), date: 'Phase 2', subject: 'Misc', description: 'Numericals + Writing practice', completed: false, phase: 2 },
      { id: generateId(), date: 'Phase 2', subject: 'Misc', description: 'Weekly full test', completed: false, phase: 2 },
      { id: generateId(), date: 'Phase 2', subject: 'Misc', description: 'Formula & keywords glance', completed: false, phase: 2 },
    ]
  },
  {
    date: '5 FEB',
    tasks: [
      { id: generateId(), date: '5 FEB', subject: 'Misc', description: 'Formula sheets', completed: false, phase: 2 },
      { id: generateId(), date: '5 FEB', subject: 'Misc', description: 'Diagrams', completed: false, phase: 2 },
      { id: generateId(), date: '5 FEB', subject: 'Misc', description: 'Definitions', completed: false, phase: 2 },
    ]
  }
];

export const SUBJECT_COLORS: Record<Subject, string> = {
  Maths: 'bg-blue-100 text-blue-700 border-blue-200',
  English: 'bg-purple-100 text-purple-700 border-purple-200',
  Hindi: 'bg-orange-100 text-orange-700 border-orange-200',
  Science: 'bg-green-100 text-green-700 border-green-200',
  Physics: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  Chemistry: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Biology: 'bg-lime-100 text-lime-700 border-lime-200',
  Grammar: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  SST: 'bg-amber-100 text-amber-700 border-amber-200',
  Computer: 'bg-slate-100 text-slate-700 border-slate-200',
  Retail: 'bg-rose-100 text-rose-700 border-rose-200',
  Revision: 'bg-red-100 text-red-700 border-red-200',
  Misc: 'bg-gray-100 text-gray-700 border-gray-200',
};
