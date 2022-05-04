import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAlert from "../hooks/useAlert";
import api, {
  Category,
  Teacher,
  Discipline,
  TestByTeacher
} from "../services/api";
import Form from "../components/Form";
import Autocomplete from '@mui/material/Autocomplete';


export interface CategoryAc {
  label: string;
  id: number;
  
}
const styles = {
  container: {
    marginTop: "18px",
    width: "460px",
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
  },
  title: { marginBottom: "30px" },
  dividerContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "16px",
    marginBottom: "26px",
  },
  input: { marginBottom: "16px" },
  actionsContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
};
interface FormData {
  title: string;
  urlPdf: string;
  category: string;
  discipline: string;
  teacher: string;
}

function Adicionar() {
  const { setMessage } = useAlert();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    title: "",
    urlPdf: "",
    category: "",
    discipline: "",
    teacher: "",

  })
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesAc, setCategoriesAc] = useState<CategoryAc[]>([]);
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [teacher, setTeachers] = useState<Teacher[]>([]);
  const [teachersDisciplines, setTeachersDisciplines] = useState<
  TestByTeacher[]
>([]);

  // useEffect(() => {
  //   async function loadPage() {
  //     if (!token) return;

  //     const { data: teachers } = await api.getTestsByTeacher(token);
  //     setTeachersDisciplines(teachers.tests);
  //     const { data: categoriesData } = await api.getCategories(token);
  //     setCategories(categoriesData.categories);
  //     const { data: courses } = await api.getDisciplines(token);
  //     setDisciplines(courses.disciplines);
  //   }
  //   loadPage();
  // }, [token]);

  // setTeachers(getUniqueTeachers(teachersDisciplines));
  // setCategoriesAc(categories.map(obj => {
  //   return {
  //     label: obj.name,
  //     id: obj.id
  //   };
  // }))
  
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  // function getUniqueTeachers(teachersDisciplines: TestByTeacher[]) {
  //   return [
  //     ...new Set(
  //       teachersDisciplines.map(
  //         (teacherDiscipline) => (
  //           {id:teacherDiscipline.teacher.id,
  //            name:teacherDiscipline.teacher.name}
  //            )
  //       )
  //     ),
  //   ];
  // }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    if (
      !formData?.title ||
      !formData?.urlPdf ||
      !formData?.category ||
      !formData?.discipline ||
      !formData?.teacher
    ) {
      setMessage({ type: "error", text: "Todos os campos são obrigatórios!" });
      return;
    }

    const {title , urlPdf, category, discipline, teacher } = formData;

    // try {
    //   await api.signUp({ email, password });
    //   setMessage({ type: "success", text: "Cadastro efetuado com sucesso!" });
    //   navigate("/login");
    // } catch (error: Error | AxiosError | any) {
    //   if (error.response) {
    //     setMessage({
    //       type: "error",
    //       text: error.response.data,
    //     });
    //     return;
    //   }
    //   setMessage({
    //     type: "error",
    //     text: "Erro, tente novamente em alguns segundos!",
    //   });
    // }
  }


  return (
    <>
      <Typography
        sx={{ marginX: "auto", marginBottom: "25px" }} color=" #000000CC"
      >Adicione uma prova</Typography>
      <Divider sx={{ marginBottom: "35px" }} />
      <Box
        sx={{
          marginX: "auto",
          width: "700px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="outlined"
            onClick={() => navigate("/app/disciplinas")}
          >
            Disciplinas
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate("/app/pessoas-instrutoras")}
          >
            Pessoa Instrutora
          </Button>
          <Button variant="contained" onClick={() => navigate("/app/adicionar")}>
            Adicionar
          </Button>
        </Box>
      <Form onSubmit={handleSubmit}>
      <Box sx={styles.container}>
        <TextField
          name="titulo"
          sx={styles.input}
          label="Titulo da prova"
          type="text"
          variant="outlined"
          onChange={handleInputChange}
          value={formData.title}
        />
         <TextField
          name="url"
          sx={styles.input}
          label="PDF da prova"
          type="text"
          variant="outlined"
          onChange={handleInputChange}
          value={formData.title}
        />
        <Autocomplete
        sx={styles.input}
      options={categoriesAc}
      renderInput={(params) => <TextField {...params} label="Categoria" />}
      />  
      <Autocomplete
        sx={styles.input}
      options={categoriesAc}
      renderInput={(params) => <TextField {...params} label="Disciplina" />}
      />  
      <Autocomplete
        sx={styles.input}
      options={categoriesAc}
      renderInput={(params) => <TextField {...params} label="Pessoa Instrutora" />}
      />  
        
          <Button variant="contained" type="submit">
            Enviar
          </Button>
        
      </Box>
    </Form>
      </Box>
    </>
  );
}



export default Adicionar;