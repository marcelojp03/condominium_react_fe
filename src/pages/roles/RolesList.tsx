import { useEffect, useMemo, useState } from 'react';
import { Icon, IconButton, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { FerramentasDaListagem } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { useDebounce } from '../../shared/hooks';
import { RolesService } from '../../shared/services/api/roles/RolesService';
import { IRol } from '@/shared/types/Rol';


export const RolesList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { debounce } = useDebounce();
  const navigate = useNavigate();

  const [rows, setRows] = useState<IRol[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);


  const busca = useMemo(() => {
    return searchParams.get('busca') || '';
  }, [searchParams]);


  useEffect(() => {
    setIsLoading(true);

    debounce(() => {
      RolesService.getAll() 
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
    if (confirm('Realmente desea eliminar?')) {
      RolesService.deleteById(id)
        .then(result => {
          if (result instanceof Error) {
            alert(result.message);
          } else {
            setRows(oldRows => [
              ...oldRows.filter(oldRow => oldRow.id !== id),
            ]);
            alert('Rol eliminado con exito!');
          }
        });
    }
  };


  return (
    <LayoutBaseDePagina
      titulo='Lista de roles'
      barraDeHerramientas={
        <FerramentasDaListagem
          mostrarInputBusca
          textoDaBusca={busca}
          textoBotaoNovo='Nuevo'
          aoClicarEmNovo={() => navigate('/roles/detalle/nuevo')}
          aoMudarTextoDeBusca={texto => setSearchParams({ busca: texto, pagina: '1' }, { replace: true })}
        />
      }
    >
      <TableContainer component={Paper} variant="outlined" sx={{ m: 1, width: 'auto' }}>
      <Table>
      <TableHead>
        <TableRow>
          <TableCell>Id</TableCell>
          <TableCell>Nombre</TableCell>
          <TableCell>Descripcion</TableCell>
          <TableCell>Estado</TableCell>
          <TableCell width={100}>Opciones</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map(row => (
          <TableRow key={row.id}>
            <TableCell>{row.id}</TableCell>
            <TableCell>{row.nombre}</TableCell>
            <TableCell>{row.descripcion}</TableCell>            
            {
            row.estado == true ?
              <TableCell>Activo</TableCell>
              :
              <TableCell>Inactivo</TableCell> 
            }
            

            <TableCell>
              <IconButton size="small" onClick={() => handleDelete(row.id)}>
                <Icon>delete</Icon>
              </IconButton>
              <IconButton size="small" onClick={() => navigate(`/roles/detalle/${row.id}`)}>
                <Icon>edit</Icon>
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>

      {totalCount === 0 && !isLoading && (
        <caption>No se encontraron roles</caption>
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
