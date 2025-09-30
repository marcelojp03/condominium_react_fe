import React, { useMemo } from 'react';
import {
  Avatar,
  Divider,
  Drawer,
  Icon,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useMatch, useNavigate, useResolvedPath } from 'react-router-dom';
import { Box } from '@mui/system';

import { useAppThemeContext, useAuthContext, useDrawerContext } from '../../contexts';
import { useMenuContext } from '../../contexts/MenuContext';

import MenuIcon from '@mui/icons-material/Menu';

export interface ISubrecurso {
  nombre: string;
  descripcion: string;
  url: string;
}

export interface IRecurso {
  nombre: string;
  descripcion: string;
  subrecursos: ISubrecurso[];
}

interface IListItemLinkProps {
  to: string;
  icon: string;
  label: string;
  onClick?: () => void;
}

const ListItemLink: React.FC<IListItemLinkProps> = ({ to, icon, label, onClick }) => {
  const navigate = useNavigate();
  const resolvedPath = useResolvedPath(to);
  const match = useMatch({ path: resolvedPath.pathname, end: true });

  const handleClick = () => {
    navigate(to);
    onClick?.();
  };

  return (
    <ListItemButton
      selected={!!match}
      onClick={handleClick}
      aria-label={label}
      sx={{
        '&.Mui-selected': {
          backgroundColor: 'action.selected',
        },
      }}
    >
      <ListItemIcon>
        <Icon>{icon}</Icon>
      </ListItemIcon>
      <ListItemText primary={label} />
    </ListItemButton>
  );
};

interface IMenuLateralProps {
  children: React.ReactNode;
}

export const MenuLateral: React.FC<IMenuLateralProps> = ({ children }) => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));

  const { isDrawerOpen, toggleDrawerOpen } = useDrawerContext();
  const { toggleTheme } = useAppThemeContext();
  const { logout } = useAuthContext();
  const navigate = useNavigate();
  const { menu } = useMenuContext();

  const renderedMenu = useMemo(
    () =>
      menu.map((recurso: IRecurso) => (
        <Box key={recurso.nombre}>
          <ListSubheader
            disableSticky
            sx={{
              fontWeight: 'bold',
              fontSize: '1rem',
              color: 'text.secondary',
              bgcolor: 'transparent',
              pl: 2,
              pt: 2,
            }}
          >
            {recurso.nombre}
          </ListSubheader>

          {recurso.subrecursos.map((sub: ISubrecurso) => (
            <ListItemLink
              key={sub.url}
              to={sub.url}
              icon="fiber_manual_record"
              label={sub.nombre}
              onClick={smDown ? toggleDrawerOpen : undefined}
            />
          ))}
        </Box>
      )),
    [menu, smDown, toggleDrawerOpen]
  );

  return (
    <>
{/* Botón flotante para mostrar menú */}
  <Box
    position="fixed"
    top={16}
    left={16}
    zIndex={1300}
    display={isDrawerOpen ? 'none' : 'block'}
  >
    <IconButton color="primary" onClick={toggleDrawerOpen}>
      <MenuIcon />
    </IconButton>
  </Box>

  {/* Drawer */}
  <Drawer
    open={isDrawerOpen}
    variant={smDown ? 'temporary' : 'persistent'}
    onClose={toggleDrawerOpen}
  >
    <Box width={theme.spacing(28)} height="100%" display="flex" flexDirection="column">
      {/* Cabecera Drawer */}
      <Box display="flex" justifyContent="space-between" alignItems="center" px={1} py={2}>
        <Avatar
          sx={{ height: theme.spacing(12), width: theme.spacing(12) }}
          src="https://yt3.ggpht.com/grfYgQadT8iNg9WPb-jkrKB-9224y_DBDXAOtV4Yt7cyQmtR47J_453uveQOTDsp_dRSH851TMM=s108-c-k-c0x00ffffff-no-rj"
        />
        <IconButton onClick={toggleDrawerOpen}>
          <ChevronLeftIcon />
        </IconButton>
      </Box>

      {/* Menú */}
      <Divider />
      <List component="nav">{renderedMenu}

        <ListItemButton onClick={toggleTheme}>
                <ListItemIcon>
                  <Icon>dark_mode</Icon>
                </ListItemIcon>
                <ListItemText primary="Cambiar tema" />
              </ListItemButton>
              <ListItemButton onClick={() => navigate('/logout')}>
                <ListItemIcon>
                  <Icon>logout</Icon>
                </ListItemIcon>
                <ListItemText primary="Cerrar sesión" />
              </ListItemButton>
      </List>



    </Box>



    
  </Drawer>

  {/* Contenido */}
  <Box
    sx={{
      height: '100vh',
      marginLeft: smDown || !isDrawerOpen ? 0 : theme.spacing(28),
      transition: 'margin 0.3s',
    }}
  >
    {children}
  </Box>




    </>
  );
};
