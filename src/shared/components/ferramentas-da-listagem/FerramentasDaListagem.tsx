import { Box, Button, Icon, Paper, TextField, useTheme } from '@mui/material';

import { Environment } from '../../environment';


interface IFerramentasDaListagemProps {
  textoDaBusca?: string;
  mostrarInputBusca?: boolean;
  aoMudarTextoDeBusca?: (novoTexto: string) => void;
  textoBotaoNovo?: string;
  mostrarBotaoNovo?: boolean;
  aoClicarEmNovo?: () => void;
  textoBotaoExportar?: string;
  mostrarBotaoExportar?: boolean;
  aoClicarEmExportar?: () => void;
  textoBotaoImportar?: string;
  mostrarBotaoImportar?: boolean;
  aoClicarEmImportar?: () => void;
  children?: React.ReactNode;
}
export const FerramentasDaListagem: React.FC<IFerramentasDaListagemProps> = ({
  textoDaBusca = '',
  mostrarInputBusca = false,
  aoMudarTextoDeBusca,
  textoBotaoNovo = 'Novo',
  mostrarBotaoNovo = true,
  aoClicarEmNovo,
  textoBotaoExportar = 'Exportar',
  mostrarBotaoExportar = false,
  aoClicarEmExportar,
  textoBotaoImportar = 'Importar',
  mostrarBotaoImportar = false,
  aoClicarEmImportar,
  children,
}) => {
  const theme = useTheme();

  return (
    <Box
      gap={1}
      marginX={1}
      padding={1}
      paddingX={2}
      display="flex"
      alignItems="center"
      height={theme.spacing(5)}
      component={Paper}
    >
      {mostrarInputBusca && (
        <TextField
          size="small"
          value={textoDaBusca}
          placeholder={Environment.INPUT_DE_BUSCA}
          onChange={(e) => aoMudarTextoDeBusca?.(e.target.value)}
          InputProps={{
            startAdornment: (
              <Icon sx={{ mr: 1, color: 'text.secondary' }}>search</Icon>
            ),
          }}
          sx={{ minWidth: 250 }}
        />
      )}

      <Box flex={1} display="flex" justifyContent="end" gap={1}>
        {children}
        
        {mostrarBotaoImportar && (
          <Button
            color="primary"
            disableElevation
            variant="outlined"
            onClick={aoClicarEmImportar}
            startIcon={<Icon>upload</Icon>}
          >
            {textoBotaoImportar}
          </Button>
        )}

        {mostrarBotaoExportar && (
          <Button
            color="primary"
            disableElevation
            variant="outlined"
            onClick={aoClicarEmExportar}
            startIcon={<Icon>download</Icon>}
          >
            {textoBotaoExportar}
          </Button>
        )}

        {mostrarBotaoNovo && (
          <Button
            color="primary"
            disableElevation
            variant="contained"
            onClick={aoClicarEmNovo}
            startIcon={<Icon>add</Icon>}
          >
            {textoBotaoNovo}
          </Button>
        )}
      </Box>
    </Box>
  );
};
