import { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';

import { LayoutBaseDePagina } from '../../shared/layouts';

import { UsuariosService } from '../../shared/services/api/usuarios/UsuariosService';


export const Dashboard = () => {
  const [isLoadingCidades, setIsLoadingCidades] = useState(true);
  const [isLoadingPessoas, setIsLoadingPessoas] = useState(true);
  const [totalCountCidades] = useState(0);
  const [totalCountPessoas, setTotalCountPessoas] = useState(0);

  useEffect(() => {
    setIsLoadingCidades(true);
    setIsLoadingPessoas(true);


    UsuariosService.getAll()
      .then((result) => {
        setIsLoadingPessoas(false);

        if (result instanceof Error) {
          alert(result.message);
        } else {
          setTotalCountPessoas(result.totalCount);
        }
      });
  }, []);


  return (
    <LayoutBaseDePagina
      titulo='Dashboard'
      // barraDeHerramientas={<FerramentasDaListagem mostrarBotaoNovo={false} />}
    >
      <Box width='100%' display='flex'>
        <Grid container margin={2}>
          <Grid container spacing={2}>

            <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4, xl: 3 }}>

              <Card>
                <CardContent>
                  <Typography variant='h5' align='center'>
                    Usuarios
                  </Typography>

                  <Box padding={6} display='flex' justifyContent='center' alignItems='center'>
                    {!isLoadingPessoas && (
                      <Typography variant='h1'>
                        {totalCountPessoas}
                      </Typography>
                    )}
                    {isLoadingPessoas && (
                      <Typography variant='h6'>
                        Cargando...
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>

            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4, xl: 3 }}>

              <Card>
                <CardContent>
                  <Typography variant='h5' align='center'>
                    Tallas
                  </Typography>

                  <Box padding={6} display='flex' justifyContent='center' alignItems='center'>
                    {!isLoadingCidades && (
                      <Typography variant='h1'>
                        {totalCountCidades}
                      </Typography>
                    )}
                    {isLoadingCidades && (
                      <Typography variant='h6'>
                        Cargando...
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>

            </Grid>

          </Grid>
        </Grid>
      </Box>
    </LayoutBaseDePagina>
  );
};
