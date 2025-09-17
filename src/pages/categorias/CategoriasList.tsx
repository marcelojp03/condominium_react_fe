import { Icon, IconButton, LinearProgress, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDebounce } from "../../shared/hooks";
import { useEffect, useMemo, useState } from "react";
import { CategoriasService, ICategoriasList } from "../../shared/services/api/categorias/CategoriasService";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { FerramentasDaListagem } from "../../shared/components";
import { Environment } from "../../shared/environment";

export const CategoriasList: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { debounce } = useDebounce();
    const navigate = useNavigate();
  
    const [rows, setRows] = useState<ICategoriasList[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
  
  
    const busca = useMemo(() => {
      return searchParams.get('busca') || '';
    }, [searchParams]);
  
    const pagina = useMemo(() => {
      return Number(searchParams.get('pagina') || '1');
    }, [searchParams]);
  
  
    useEffect(() => {
      setIsLoading(true);
  
      debounce(() => {
        CategoriasService.getAll(pagina,busca)
          .then((result) => {
            setIsLoading(false);
  
            if (result instanceof Error) {
              alert(result.message);
            }
             else {
              console.log("result");
              console.log(result.data);
              
              setTotalCount(result.totalCount);
              setRows(result.data);
              
             }
          });
      });
    },[busca, pagina]
    );
  
    const handleDelete = (id: number) => {
      if (confirm('Realmente deseja apagar?')) {
        CategoriasService.deleteById(id)
          .then(result => {
            if (result instanceof Error) {
              alert(result.message);
            } else {
              setRows(oldRows => [
                ...oldRows.filter(oldRow => oldRow.id !== id),
              ]);
              alert('Contacto eliminado con exito!');
            }
          });
      }
    };
  
  
    return (
      <LayoutBaseDePagina
        titulo='Lista de categorias'
        barraDeFerramentas={
          <FerramentasDaListagem
            mostrarInputBusca
            textoDaBusca={busca}
            textoBotaoNovo='Nuevo'
            aoClicarEmNovo={() => navigate('/categorias/detalle/nuevo')}
            aoMudarTextoDeBusca={texto => setSearchParams({ busca: texto, pagina: '1' }, { replace: true })}
          />
        }
      >
        <TableContainer component={Paper} variant="outlined" sx={{ m: 1, width: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nombre</TableCell>
                {/* <TableCell>Descripción</TableCell> */}
                {/* <TableCell>Estado</TableCell> */}
                <TableCell width={100}>Opciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(row => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  {/* <TableCell>{row.description}</TableCell> */}
                        {/* {row.status==true ? (
                            <TableCell>Activo</TableCell>
                                ) : (
                            <TableCell>Inactivo</TableCell>
                        )} */}
        
                  { <TableCell>
                    <IconButton size="small" onClick={() => handleDelete(row.id)}>
                      <Icon color="error">delete</Icon>
                    </IconButton>
                    <IconButton size="small" onClick={() => navigate(`/contactos/detalle/${row.id}`)}>
                      <Icon color="info">edit</Icon>
                    </IconButton>
                  </TableCell> }
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
                      onChange={(_, newPage) => setSearchParams({ busca, pagina: newPage.toString() }, { replace: true })}
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
  