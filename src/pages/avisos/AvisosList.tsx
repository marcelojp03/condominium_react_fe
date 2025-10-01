import { useEffect, useMemo, useState } from 'react';
import { Icon, IconButton, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { FerramentasDaListagem } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { useDebounce } from '../../shared/hooks';
import { AvisosService } from '../../shared/services/api/avisos/AvisosService';

import { IAvisoResponse } from '@/shared/types/Aviso';


export const AvisosList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { debounce } = useDebounce();
  const navigate = useNavigate();

  const [rows, setRows] = useState<IAvisoResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);


  const busca = useMemo(() => {
    return searchParams.get('busca') || '';
  }, [searchParams]);



  useEffect(() => {
    setIsLoading(true);

    debounce(() => {
      AvisosService.getAll() 
        .then((result) => {
          
          setIsLoading(false);

          if (result instanceof Error) {
            alert(result.message);
          } else {
            setTotalCount(result.totalCount);
            setRows(result.data);  
          }
        });
    });
}, []);


  const handleDelete = (id: number) => {
    if (confirm('Realmente deseja apagar?')) {
      AvisosService.deleteById(id)
        .then(result => {
          if (result instanceof Error) {
            alert(result.message);
          } else {
            setRows(oldRows => [
              ...oldRows.filter(oldRow => oldRow.idaviso !== id),
            ]);
            alert('Registro eliminado con exito!');
          }
        });
    }
  };


  return (
    <LayoutBaseDePagina
      titulo='Lista de unidades'
      barraDeHerramientas={
        <FerramentasDaListagem
          mostrarInputBusca
          textoDaBusca={busca}
          textoBotaoNovo='Nuevo'
          aoClicarEmNovo={() => navigate('/unidades/detalle/nuevo')}
          aoMudarTextoDeBusca={texto => setSearchParams({ busca: texto, pagina: '1' }, { replace: true })}
        />
      }
    >
      <TableContainer component={Paper} variant="outlined" sx={{ m: 1, width: 'auto' }}>
      <Table>
      <TableHead>
        <TableRow>
          <TableCell>Id</TableCell>
          <TableCell>Titulo</TableCell>
          <TableCell>Contenido</TableCell>
          <TableCell>Fecha publicacion</TableCell>
          <TableCell>Estado</TableCell>
          <TableCell width={100}>Opciones</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map(row => (
          <TableRow key={row.idaviso}>
            <TableCell>{row.idaviso}</TableCell>
            <TableCell>{row.titulo}</TableCell>
            <TableCell>{row.contenido}</TableCell>            
            <TableCell>{row.fecha_publicacion}</TableCell>            
            {
            row.estado == true ?
              <TableCell>Activo</TableCell>
              :
              <TableCell>Inactivo</TableCell> 
            }
            

            <TableCell>
              <IconButton size="small" onClick={() => handleDelete(row.idaviso)}>
                <Icon>delete</Icon>
              </IconButton>
              <IconButton size="small" onClick={() => navigate(`/avisos/detalle/${row.idaviso}`)}>
                <Icon>edit</Icon>
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>

      {totalCount === 0 && !isLoading && (
        <caption>No se encontraron avisos</caption>
      )}

      <TableFooter>
        {isLoading && (
          <TableRow>
            <TableCell colSpan={5}>
              <LinearProgress variant='indeterminate' />
            </TableCell>
          </TableRow>
        )}
      </TableFooter>
    </Table>
    </TableContainer>
    </LayoutBaseDePagina>
  );
};
