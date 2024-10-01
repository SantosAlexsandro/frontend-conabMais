import { BrowserRouter } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

import './shared/forms/TraducoesYup';

import { AppThemeProvider, AuthProvider, DrawerProvider } from './shared/contexts';
import { Login, MenuLateral } from './shared/components';
import { AppRoutes } from './routes';


export const App = () => {
  return (
    <AuthProvider>
      <AppThemeProvider>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <Login>

            <DrawerProvider>
              <BrowserRouter>

                <MenuLateral>
                  <AppRoutes />
                </MenuLateral>

              </BrowserRouter>
            </DrawerProvider>

          </Login>
        </LocalizationProvider>
      </AppThemeProvider>
    </AuthProvider>
  );
};
