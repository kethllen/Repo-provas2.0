import axios from "axios";

const baseAPI = axios.create({
  baseURL: "http://localhost:5000/",
});

interface UserData {
  email: string;
  password: string;
}

function getConfig(token: string) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

async function signUp(signUpData: UserData) {
  await baseAPI.post("/sign-up", signUpData);
}

async function signIn(signInData: UserData) {
  return baseAPI.post<{ token: string }>("/sign-in", signInData);
}

export interface Term {
  id: number;
  number: number;
}

export interface Discipline {
  id: number;
  name: string;
  teacherDisciplines: TeacherDisciplines[];
  term: Term;
}

export interface TeacherDisciplines {
  id: number;
  discipline: Discipline;
  teacher: Teacher;
  tests: Test[];
}

export interface Teacher {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Test {
  id: number;
  name: string;
  pdfUrl: string;
  category: Category;
}

export type TestByDiscipline = Term & {
  disciplines: Discipline[];
};

export type TestByTeacher = TeacherDisciplines & {
  teacher: Teacher;
  disciplines: Discipline[];
  tests: Test[];
};

async function getTestsByDiscipline(token: string) {
  const config = getConfig(token);
  return baseAPI.get<{ tests: TestByDiscipline[] }>(
    "/tests?groupBy=disciplines",
    config
  );
}

async function getTestsByTeacher(token: string) {
  const config = getConfig(token);
  return baseAPI.get<{ tests: TestByTeacher[] }>(
    "/tests?groupBy=teachers",
    config
  );
}

async function getCategories(token: string) {
  const config = getConfig(token);
  return baseAPI.get<{ categories: Category[] }>("/categories", config);
}

async function getDisciplines(token: string) {
  const config = getConfig(token);
  return baseAPI.get<{ disciplines: Discipline[] }>("/disciplines", config);
}

export async function createTest(token: string, data: any) {
  const config = getConfig(token)

  const formData = new FormData()

  formData.append("name", data.name)
  formData.append("pdfUrl", data.pdfUrl)
  formData.append("categoryId", data.categoryId)
  formData.append("teacherDisciplineId", data.teacherDisciplineId)

  baseAPI.post("/test", formData,config)

}

export async function addViewCount(token: string, id: number) {
  const config = getConfig(token)

  baseAPI.patch(`/test/${id}/addView`, {}, config)

}

export async function getInstructorsByDiscipline(token: string, id: number | string){
  const config = getConfig(token)
  baseAPI.get(`/instructors/disciplines/${id}`, config)
}

const api = {
  signUp,
  signIn,
  getTestsByDiscipline,
  getTestsByTeacher,
  getCategories,
  getDisciplines,
  getInstructorsByDiscipline
};

export default api;
