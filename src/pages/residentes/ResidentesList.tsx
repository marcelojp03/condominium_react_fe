import { useEffect, useMemo, useState } from 'react';
import { Icon, IconButton, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { FerramentasDaListagem } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { useDebounce } from '../../shared/hooks';
import { ResidentesService } from '../../shared/services/api/residentes/ResidentesService';
import { IResidenteResponse } from '@/shared/types/Residente';


export const ResidentesList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { debounce } = useDebounce();
  const navigate = useNavigate();

  const [rows, setRows] = useState<IResidenteResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);


  const busca = useMemo(() => {
    return searchParams.get('busca') || '';
  }, [searchParams]);



  useEffect(() => {
    setIsLoading(true);

    debounce(() => {
      ResidentesService.getAll() 
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
      ResidentesService.deleteById(id)
        .then(result => {
          if (result instanceof Error) {
            alert(result.message);
          } else {
            setRows(oldRows => [
              ...oldRows.filter(oldRow => oldRow.idresidente !== id),
            ]);
            alert('Registro eliminado con exito!');
          }
        });
    }
  };


  return (
    <LayoutBaseDePagina
      titulo='Lista de residentes'
      barraDeHerramientas={
        <FerramentasDaListagem
          mostrarInputBusca
          textoDaBusca={busca}
          textoBotaoNovo='Nuevo'
          aoClicarEmNovo={() => navigate('/residentes/detalle/nuevo')}
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
          <TableCell>Apellido 1</TableCell>
          <TableCell>Apellido 2</TableCell>
          <TableCell>Unidad</TableCell>
          <TableCell>Relacion</TableCell>
          <TableCell>Estado</TableCell>
          <TableCell width={100}>Opciones</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map(row => (
          <TableRow key={row.idresidente}>
            <TableCell>{row.idresidente}</TableCell>
            <TableCell>{row.nombres}</TableCell>
            <TableCell>{row.apellido1}</TableCell>            
            <TableCell>{row.apellido2}</TableCell>            
            <TableCell>{row.codigo_unidad}</TableCell>            
            <TableCell>{row.relacion}</TableCell>            
            {
            row.estado == true ?
              <TableCell>Activo</TableCell>
              :
              <TableCell>Inactivo</TableCell> 
            }
            

            <TableCell>
              <IconButton size="small" onClick={() => handleDelete(row.idresidente)}>
                <Icon>delete</Icon>
              </IconButton>
              <IconButton size="small" onClick={() => navigate(`/residentes/detalle/${row.idresidente}`)}>
                <Icon>edit</Icon>
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>

      {totalCount === 0 && !isLoading && (
        <caption>No se encontraron registros</caption>
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
