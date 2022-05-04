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
  const [category, setCategory] = useState(null);
  const [categoriesAc, setCategoriesAc] = useState<CategoryAc[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryInputValue, setCategoryInputValue] = useState('');

  const [discipline, setDiscipline] = useState(null);
  const [disciplinesAc, setDisciplinesAc] = useState<CategoryAc[]>([]);
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [disciplineInputValue, setDisciplineInputValue] = useState('');

  const [instructor, setInstructor] = useState(null);
  const [instructorsAc, setInstructorsAc] = useState<CategoryAc[]>([]);
  const [instructors, setInstructors] = useState(null);
  const [instructorInputValue, setInstructorInputValue] = useState('');


  useEffect(() => {
    async function loadPage() {
      if (!token) return;

      const { data: categoriesData } = await api.getCategories(token);
      setCategories(categoriesData.categories);

      const { data: courses } = await api.getDisciplines(token);
      setDisciplines(courses.disciplines);
      
    }
    
    loadPage();
  }, [token]);
  useEffect( () =>{
  
    setCategoriesAc(categories.map(obj => {
      return {
        label: obj.name,
        id: obj.id
      };
    }))
    setDisciplinesAc(disciplines.map(obj => {
      return {
        label: obj.name,
        id: obj.id
      };
    }))
    teachersData()
     
  
  }, [disciplines])
   
  async function teachersData(){
    let promise;
    if (discipline !== null) {
      promise = await api.getInstructorsByDiscipline(token,
        discipline?.id
      );
    } else {
      promise = await api.getInstructorsByDiscipline(token,
        ""
      );
    }

    setInstructors(promise?.data);
  }
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function getUniqueTeachers(teachersDisciplines: TestByTeacher[]) {
    return [
      ...new Set(
        teachersDisciplines.map(
          (teacherDiscipline) => (
            {id:teacherDiscipline.teacher.id,
             name:teacherDiscipline.teacher.name}
             )
        )
      ),
    ];
  }
  
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
        value={formData.category}
        onChange={(event, newValue) => {
          setFormData({ ...formData, [e.target.name]: e.target.value })
        }}
        inputValue={categoryInputValue}
        onInputChange={(event, newInputValue) => {
          setCategoryInputValue(newInputValue);
        }}
        id="categories"
        options={categoriesAc}
        // isOptionEqualToValue={(category) => { return ({ id: category.id, label: category.name }) }}
        renderInput={(params) => <TextField {...params} label="Categoria" required />}
        sx={styles.input}/>
      <Autocomplete
           value={formData.discipline}
           onChange={(event, newValue) => {
             setFormData({ ...formData, [e.target.name]: e.target.value })
           }}
           inputValue={disciplineInputValue}
           onInputChange={(event, newInputValue) => {
             setDisciplineInputValue(newInputValue);
           }}
           id="disciplines"
           options={disciplinesAc}
          
           renderInput={(params) => <TextField {...params} label="Disciplina" />}
           sx={styles.input}/>
      <Autocomplete
        value={formData.teacher}
        onChange={(event, newValue) => {
          setFormData({ ...formData, [e.target.name]: e.target.value })
        }}
        inputValue={instructorInputValue}
        onInputChange={(event, newInputValue) => {
          setInstructorInputValue(newInputValue);
        }}
        id="instructors"
        options={instructorsAc}
       
        renderInput={(params) => <TextField {...params} label="Pessoa Instrutora" />}
        sx={styles.input}/>

        
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