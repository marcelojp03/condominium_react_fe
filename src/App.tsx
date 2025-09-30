import { BrowserRouter } from 'react-router-dom';
import { AppThemeProvider, AuthProvider, DrawerProvider } from './shared/contexts';
import { AppRoutes } from './routes';
import { MenuProvider } from './shared/contexts/MenuContext';


export const App = () => {
  return (
    <AuthProvider>
      <MenuProvider> {/* ✅ Agregado aquí */}
        <AppThemeProvider>
          <BrowserRouter>
            <DrawerProvider>
              <AppRoutes />
            </DrawerProvider>
          </BrowserRouter>
        </AppThemeProvider>
      </MenuProvider>
    </AuthProvider>
  );
};
