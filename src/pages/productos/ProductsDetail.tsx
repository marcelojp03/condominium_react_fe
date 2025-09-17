import { useState } from 'react';
import { Box, Grid, LinearProgress, Paper, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
// import * as yup from 'yup'; // Legacy - component not in active routes

// import { PessoasService } from '../../shared/services/api/pessoas/PessoasService'; // Legacy - not used
// import { VTextField, VForm, useVForm, IVFormErrors } from '../../shared/forms'; // Legacy - removed
import { FerramentasDeDetalhe } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';
// import { CategoriasService } from '../../shared/services/api/categorias/CategoriasService'; // Legacy - not used
// import { TallasService } from '../../shared/services/api/tallas/TallasService'; // Legacy - not used  
// import { GenerosService } from '../../shared/services/api/generos/GenerosServices'; // Legacy - not used
// import { ProductService } from '../../shared/services/api/productos/ProductsService'; // Legacy - not used


// interface IFormData {
//   name: string;
//   description: string;
//   categoryId: number;
//   price: number;
//   status: boolean;
//   genderId: number;
//   sizes: number[]; // Ids de las tallas seleccionadas
//   images: string[]; // Imágenes en base64
// } // Legacy - commented out

export const ProductsDetail: React.FC = () => {
  // const { formRef, save, saveAndClose, isSaveAndClose } = useVForm(); // Legacy - commented out
  const { id = 'new' } = useParams<'id'>();
  const navigate = useNavigate();

  const [isLoading] = useState(false);

  return (
    <LayoutBaseDePagina
      titulo={id === 'new' ? 'Nuevo Producto' : 'Editar Producto'}
      barraDeHerramientas={
        <FerramentasDeDetalhe
          textoBotaoNovo='Nuevo'
          mostrarBotaoSalvarEFechar={false}
          mostrarBotaoNovo={id !== 'new'}
          mostrarBotaoApagar={id !== 'new'}
          // aoClicarEmSalvar={save} // Legacy - commented out
          // aoClicarEmSalvarEFechar={saveAndClose} // Legacy - commented out
          aoClicarEmVoltar={() => navigate('/products')}
        />
      }
    >
      {/* Legacy form - commented out */}
      <Box margin={1} display="flex" flexDirection="column" component={Paper} variant="outlined">
        <Grid container direction="column" padding={2} spacing={2}>
          {isLoading && <Grid><LinearProgress variant='indeterminate' /></Grid>}
          <Grid>
            <Typography variant='h6'>Esta página usa el sistema de formularios legacy y no está disponible</Typography>
          </Grid>
        </Grid>
      </Box>
    </LayoutBaseDePagina>
  );
};
