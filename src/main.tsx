import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Auth0ProviderWithNavigate } from './componentes/auth0/Auth0ProviderWithNavigate';
import LoaderPage from './componentes/loaderPage/LoaderPage';
import { EmpresasContextProvider } from './context/EmpresasContext';
import { SucursalesContextProvider } from './context/SucursalesContext';
import { ClienteContextProvider } from './context/ClienteContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <Suspense fallback={<LoaderPage />}>
    <BrowserRouter>
      <Auth0ProviderWithNavigate>
      <EmpresasContextProvider>
      <SucursalesContextProvider>
      <ClienteContextProvider>
      <App />
      </ClienteContextProvider>
      </SucursalesContextProvider>
      </EmpresasContextProvider>
      </Auth0ProviderWithNavigate>
    </BrowserRouter>
    </Suspense>
);