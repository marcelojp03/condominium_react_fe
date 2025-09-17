import { useState } from 'react';
import { Box, Grid, LinearProgress, Paper, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
// import * as yup from 'yup'; // Legacy - component not in active routes

import { PessoasService } from '../../shared/services/api/pessoas/PessoasService';
// import { VTextField, VForm, useVForm, IVFormErrors } from '../../shared/forms'; // Legacy - removed
// import { AutoCompleteCidade } from './components/AutoCompleteCidade'; // Legacy - not used
import { FerramentasDeDetalhe } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';

// interface IFormData {
//   email: string;
//   cidadeId: number;
//   nomeCompleto: string;
// } // Legacy - commented out
// const formValidationSchema: yup.SchemaOf<IFormData> = yup.object().shape({
//   cidadeId: yup.number().required(),
//   email: yup.string().required().email(),
//   nomeCompleto: yup.string().required().min(3),
// }); // Legacy - commented out

export const DetalheDePessoas: React.FC = () => {
  // const { formRef, save, saveAndClose, isSaveAndClose } = useVForm(); // Legacy - commented out
  const { id = 'nova' } = useParams<'id'>();
  const navigate = useNavigate();

  const [isLoading] = useState(false); // Removed setIsLoading since it's not used
  const [nome] = useState(''); // Removed setNome since form is disabled

  // All form logic commented out for legacy compatibility
  const handleDelete = (id: number) => {
    if (confirm('Realmente deseja apagar?')) {
      PessoasService.deleteById(id)
        .then(result => {
          if (result instanceof Error) {
            alert(result.message);
          } else {
            alert('Registro apagado com sucesso!');
            navigate('/pessoas');
          }
        });
    }
  };

  return (
    <LayoutBaseDePagina
      titulo={id === 'nova' ? 'Nova pessoa' : nome}
      barraDeHerramientas={
        <FerramentasDeDetalhe
          textoBotaoNovo='Nova'
          mostrarBotaoSalvarEFechar={false}
          mostrarBotaoNovo={id !== 'nova'}
          mostrarBotaoApagar={id !== 'nova'}
          // aoClicarEmSalvar={save} // Legacy - commented out
          // aoClicarEmSalvarEFechar={saveAndClose} // Legacy - commented out
          aoClicarEmVoltar={() => navigate('/pessoas')}
          aoClicarEmApagar={() => handleDelete(Number(id))}
          aoClicarEmNovo={() => navigate('/pessoas/detalhe/nova')}
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
