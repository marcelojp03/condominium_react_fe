import { useState } from 'react';
import { Box, Grid, LinearProgress, Paper, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
// import * as yup from 'yup'; // Legacy - component not in active routes

import { CidadesService } from '../../shared/services/api/cidades/CidadesService';
// import { VTextField, VForm, useVForm, IVFormErrors } from '../../shared/forms'; // Legacy - removed
import { FerramentasDeDetalhe } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';


// interface IFormData {
//   nome: string;
// } // Legacy - commented out
// const formValidationSchema: yup.SchemaOf<IFormData> = yup.object().shape({
//   nome: yup.string().required().min(3),
// }); // Legacy - commented out

export const DetalheDeCidades: React.FC = () => {
  // const { formRef, save, saveAndClose, isSaveAndClose } = useVForm(); // Legacy - commented out
  const { id = 'nova' } = useParams<'id'>();
  const navigate = useNavigate();


  const [isLoading] = useState(false);
  const [nome] = useState(''); // Removed setNome since it's not used

  // useEffect(() => {
  //   if (id !== 'nova') {
  //     setIsLoading(true);
  //     CidadesService.getById(Number(id))
  //       .then((result) => {
  //         setIsLoading(false);
  //         if (result instanceof Error) {
  //           alert(result.message);
  //           navigate('/cidades');
  //         } else {
  //           setNome(result.nome);
  //           formRef.current?.setData(result);
  //         }
  //       });
  //   } else {
  //     formRef.current?.setData({
  //       nome: '',
  //     });
  //   }
  // }, [id]); // Legacy - commented out

  // const handleSave = (dados: IFormData) => {
  //   // Legacy form handling - commented out
  // }; // Legacy - commented out

  const handleDelete = (id: number) => {
    if (confirm('Realmente deseja apagar?')) {
      CidadesService.deleteById(id)
        .then(result => {
          if (result instanceof Error) {
            alert(result.message);
          } else {
            alert('Registro apagado com sucesso!');
            navigate('/cidades');
          }
        });
    }
  };

  return (
    <LayoutBaseDePagina
      titulo={id === 'nova' ? 'Nova cidade' : nome}
      barraDeHerramientas={
        <FerramentasDeDetalhe
          textoBotaoNovo='Nova'
          mostrarBotaoSalvarEFechar={false}
          mostrarBotaoNovo={id !== 'nova'}
          mostrarBotaoApagar={id !== 'nova'}
          // aoClicarEmSalvar={save} // Legacy - commented out
          // aoClicarEmSalvarEFechar={saveAndClose} // Legacy - commented out
          aoClicarEmVoltar={() => navigate('/cidades')}
          aoClicarEmApagar={() => handleDelete(Number(id))}
          aoClicarEmNovo={() => navigate('/cidades/detalhe/nova')}
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
