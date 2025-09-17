import { useState } from 'react';
import { Box, Grid, LinearProgress, Paper, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
// import * as yup from 'yup'; // Legacy - component not in active routes

import { ContactosService } from '../../shared/services/api/contactos/ContactosService';
// import { VTextField, VForm, useVForm, IVFormErrors } from '../../shared/forms'; // Legacy - removed
import { FerramentasDeDetalhe } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';


// interface IFormData {
//     name: string;
//     email: string;
//     phone: string;
// } // Legacy - commented out
// const formValidationSchema: yup.SchemaOf<IFormData> = yup.object().shape({
//   email: yup.string().required().email(),
//   name: yup.string().required().min(3),
//   phone:yup.string().required(),
// }); // Legacy - commented out

export const DetalleContactos: React.FC = () => {
  // const { formRef, save, saveAndClose, isSaveAndClose } = useVForm(); // Legacy - commented out
  const { id = 'nuevo' } = useParams<'id'>();
  const navigate = useNavigate();

  const [isLoading] = useState(false);
  const [nombre] = useState(''); // Removed setNombre since form is disabled

  // useEffect(() => {
  //   // Legacy form handling - commented out
  // }, [id]); // Legacy - commented out

  // const handleSave = (dados: IFormData) => {
  //   // Legacy form handling - commented out  
  // }; // Legacy - commented out

  const handleDelete = (id: number) => {
    if (confirm('Realmente deseja apagar?')) {
      ContactosService.deleteById(id)
        .then(result => {
          if (result instanceof Error) {
            alert(result.message);
          } else {
            alert('Registro eliminado con éxito!');
            navigate('/contactos');
          }
        });
    }
  };


  return (
    <LayoutBaseDePagina
      titulo={id === 'nuevo' ? 'Nuevo contacto' : nombre}
      barraDeHerramientas={
        <FerramentasDeDetalhe
          textoBotaoNovo='Nuevo'
          mostrarBotaoSalvarEFechar={false}
          mostrarBotaoNovo={id !== 'nuevo'}
          mostrarBotaoApagar={id !== 'nuevo'}
          // aoClicarEmSalvar={save} // Legacy - commented out
          // aoClicarEmSalvarEFechar={saveAndClose} // Legacy - commented out
          aoClicarEmVoltar={() => navigate('/contactos')}
          aoClicarEmApagar={() => handleDelete(Number(id))}
          aoClicarEmNovo={() => navigate('/contactos/detalle/nuevo')}
        />
      }
    >
      {/* Legacy form - commented out */}
      <Box margin={1} display="flex" flexDirection="column" component={Paper} variant="outlined">
        <Grid container direction="column" padding={2} spacing={2}>
          {isLoading && (
            <Grid>
              <LinearProgress variant='indeterminate' />
            </Grid>
          )}
          <Grid>
            <Typography variant='h6'>Esta página usa el sistema de formularios legacy y no está disponible</Typography>
          </Grid>
        </Grid>
      </Box>
    </LayoutBaseDePagina>
  );
};
