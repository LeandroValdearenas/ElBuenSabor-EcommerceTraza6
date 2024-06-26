import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { ClienteService } from '../../../servicios/ClienteService';
import { useCliente } from '../../../context/ClienteContext';

const AuthHandler = () => {
  const { isAuthenticated, user, getAccessTokenSilently, logout } = useAuth0();
  const { handleReloadCliente } = useCliente();

  const urlapi = import.meta.env.VITE_API_URL;
  const clienteService = new ClienteService(urlapi + "/clientes");

  useEffect(() => {
    const storeToken = async () => {
      if (isAuthenticated) {
        const token = await getAccessTokenSilently({
            authorizationParams:{audience:import.meta.env.VITE_AUTH0_AUDIENCE}
        });
        localStorage.setItem('token', token);
        try {
          if (window.location.pathname !== '/registrar') {
            const usuario = await clienteService.buscarXUsuarioAuth0(user?.sub);
            localStorage.setItem('usuario', JSON.stringify(usuario));
            
            handleReloadCliente();
          }
        } catch (e) {
          localStorage.setItem('usuario', "");
          localStorage.removeItem('usuario');
          logout({logoutParams : { returnTo: window.location.origin}});
          alert("La cuenta con la que está intentando acceder no es válida. Aségurese de haberse registrado primero.");
        }
      }
    };
    storeToken();
  }, [isAuthenticated, getAccessTokenSilently]);

  return null;
};

export default AuthHandler;