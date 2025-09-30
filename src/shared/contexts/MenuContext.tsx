import { createContext, useContext, useEffect, useState } from 'react';
import { MenuService } from '../services/api/menu/MenuService';

interface ISubrecurso {
  nombre: string;
  descripcion: string;
  url: string;
}

interface IRecurso {
  nombre: string;
  descripcion: string;
  subrecursos: ISubrecurso[];
}

interface IMenuContextData {
  menu: IRecurso[];
  loadMenu: () => void;
}

const MenuContext = createContext({} as IMenuContextData);

export const useMenuContext = () => useContext(MenuContext);

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [menu, setMenu] = useState<IRecurso[]>([]);

const loadMenu = () => {
    const usuario_id = localStorage.getItem('usuario_id');
    if (usuario_id) {
      MenuService.getMenuByUsuarioId(Number(usuario_id)).then((result) => {
        if (!(result instanceof Error)) {
          setMenu(result);
        }
      });
    }
  };


  useEffect(() => {
    loadMenu(); // carga inicial
  }, []);

  return <MenuContext.Provider value={{ menu,loadMenu }}>{children}</MenuContext.Provider>;
};


