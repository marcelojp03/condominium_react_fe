import { useEffect, useMemo, useState } from 'react';
import { Icon, IconButton, LinearProgress, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { IListagemCidade, CidadesService, } from '../../shared/services/api/cidades/CidadesService';
import { HerramientasDeListado } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { Environment } from '../../shared/environment';
import { useDebounce } from '../../shared/hooks';


export const ListadoDeCiudades: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { debounce } = useDebounce();
  const navigate = useNavigate();

  const [rows, setRows] = useState<IListagemCidade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);


  const busqueda = useMemo(() => {
    let idf="pages::ciudades::Lista::useMemeo::busqueda::";
    console.log(idf + "searchParams:",searchParams);
    console.log(idf + "totalCount:",totalCount);

    return searchParams.get('busqueda') || '';
  }, [searchParams]);

  const pagina = useMemo(() => {
    let idf="pages::ciudades::Lista::useMemeo::pagina::";
    console.log(idf + "searchParams:",searchParams);
    console.log(idf + "totalCount:",totalCount);
    return Number(searchParams.get('pagina') || '1');
  }, [searchParams]);


  useEffect(() => {
    let idf="pages::ciudades::Lista::useEffect::"
    console.log(idf + "useEffect");
    setIsLoading(true);

    debounce(() => {
      CidadesService.getAll(pagina, busqueda)
        .then((result) => {
          console.log(idf+"respuesta1:",result);
          setIsLoading(false);

          if (result instanceof Error) {
            alert(result.message);
          } else {
             console.log(idf+"respuesta2:",result);
;            console.log(idf+"totalCount:",result.totalCount);
            setTotalCount(result.totalCount);
            console.log(idf+"totalCount:",result.totalCount);
            setRows(result.data);
          }
        });
    });
  }, [busqueda, pagina]);

  const manejarEliminar = (id: number) => {
    if (confirm('¿Realmente desea eliminar?')) {
      CidadesService.deleteById(id)
        .then(result => {
          if (result instanceof Error) {
            alert(result.message);
          } else {
            setRows(oldRows => [
              ...oldRows.filter(oldRow => oldRow.id !== id),
            ]);
            alert('Registro eliminado con éxito!');
          }
        });
    }
  };


  return (
    <LayoutBaseDePagina
      titulo='Listado de ciudades'
      barraDeHerramientas={
        <HerramientasDeListado
          mostrarInputBusqueda
          textoDeBusqueda={busqueda}
          textoBotonNuevo='Nueva'
          alClicEnNuevo={() => navigate('/ciudades/detalle/nueva')}
          alCambiarTextoDeBusqueda={(texto: string) => setSearchParams({ busqueda: texto, pagina: '1' }, { replace: true })}
        />
      }
    >
      <TableContainer component={Paper} variant="outlined" sx={{ m: 1, width: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width={100}>Acciones</TableCell>
              <TableCell>Nombre</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.id}>
                <TableCell>
                  <IconButton size="small" onClick={() => manejarEliminar(row.id)}>
                    <Icon>delete</Icon>
                  </IconButton>
                  <IconButton size="small" onClick={() => navigate(`/ciudades/detalle/${row.id}`)}>
                    <Icon>edit</Icon>
                  </IconButton>
                </TableCell>
                <TableCell>{row.nome}</TableCell>
              </TableRow>
            ))}
          </TableBody>

          {totalCount === 0 && !isLoading && (
            <caption>{Environment.LISTAGEM_VAZIA}</caption>
          )}

          <TableFooter>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={3}>
                  <LinearProgress variant='indeterminate' />
                </TableCell>
              </TableRow>
            )}
            {(totalCount > 0 && totalCount > Environment.LIMITE_DE_LINHAS) && (
              <TableRow>
                <TableCell colSpan={3}>
                  <Pagination
                    page={pagina}
                    count={Math.ceil(totalCount / Environment.LIMITE_DE_LINHAS)}
                    onChange={(_, newPage) => setSearchParams({ busqueda, pagina: newPage.toString() }, { replace: true })}
                  />
                </TableCell>
              </TableRow>
            )}
          </TableFooter>
        </Table>
      </TableContainer>
    </LayoutBaseDePagina>
  );
};