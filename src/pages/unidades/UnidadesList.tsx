import { useEffect, useMemo, useState } from 'react';
import { Icon, IconButton, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { FerramentasDaListagem } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { useDebounce } from '../../shared/hooks';
import { UnidadesService } from '../../shared/services/api/unidades/UnidadesService';
import { IUnidadResponse } from '@/shared/types/Unidad';


export const UnidadesList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { debounce } = useDebounce();
  const navigate = useNavigate();

  const [rows, setRows] = useState<IUnidadResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);


  const busca = useMemo(() => {
    return searchParams.get('busca') || '';
  }, [searchParams]);



  useEffect(() => {
    setIsLoading(true);

    debounce(() => {
      UnidadesService.getAll() 
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
      UnidadesService.deleteById(id)
        .then(result => {
          if (result instanceof Error) {
            alert(result.message);
          } else {
            setRows(oldRows => [
              ...oldRows.filter(oldRow => oldRow.idunidad !== id),
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
          <TableCell>Codigo</TableCell>
          <TableCell>Zona</TableCell>
          <TableCell>Estado</TableCell>
          <TableCell width={100}>Opciones</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map(row => (
          <TableRow key={row.idunidad}>
            <TableCell>{row.idunidad}</TableCell>
            <TableCell>{row.codigo}</TableCell>
            <TableCell>{row.zona}</TableCell>            
            {
            row.estado == true ?
              <TableCell>Activo</TableCell>
              :
              <TableCell>Inactivo</TableCell> 
            }
            

            <TableCell>
              <IconButton size="small" onClick={() => handleDelete(row.idunidad)}>
                <Icon>delete</Icon>
              </IconButton>
              <IconButton size="small" onClick={() => navigate(`/unidades/detalle/${row.idunidad}`)}>
                <Icon>edit</Icon>
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>

      {totalCount === 0 && !isLoading && (
        <caption>No se encontraron unidades</caption>
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
