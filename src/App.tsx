
import AuthHandler from './componentes/commons/header/Auth0Handler';
import { CartContextProvider } from './context/CartContext';
import { NextUIProvider } from '@nextui-org/react';
import { Route, Routes } from 'react-router-dom';
import { RutaPrivada } from './componentes/rutaPrivada/RutaPrivada';
import { lazy } from 'react';
import LoaderPage from './componentes/loaderPage/LoaderPage';

const Home = lazy(() => import('./paginas/Home'));
const Registrar = lazy(() => import('./componentes/registrar/Registrar'));
const CarritoCheckout = lazy(() => import('./componentes/carrito/CarritoCheckout'));
const MpFailure = lazy(() => import('./componentes/mp/MpFailure'));
const MpPending = lazy(() => import('./componentes/mp/MpPending'));
const MpSuccess = lazy(() => import('./componentes/mp/MpSuccess'));
const Perfil = lazy(() => import('./componentes/perfil/Perfil'));
const HistorialPedidos = lazy(() => import('./componentes/historialPedidos/HistorialPedido'));
const PantallaDetallePedido = lazy(() => import('./componentes/historialPedidos/PantallaDetallePedido'));

function App() {
  return (
    <NextUIProvider>
      <CartContextProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="callback" element={<LoaderPage />} />
          <Route path="registrar" element={<Registrar />} />
          <Route path="perfil" element={<RutaPrivada><Perfil/></RutaPrivada>} />
          <Route path="perfil/editar" element={<RutaPrivada><Perfil editar={true} /></RutaPrivada>} />
          <Route path="checkout" element={<RutaPrivada><CarritoCheckout /></RutaPrivada>} />
          <Route path="pedidos" element={<RutaPrivada><HistorialPedidos /></RutaPrivada>} />
          <Route path="pedidodetalle/:idpedido" element={<RutaPrivada><PantallaDetallePedido /></RutaPrivada>} />
          <Route path="mpfailure/:idpedido" element={<RutaPrivada><MpFailure /></RutaPrivada>} />
          <Route path="mppending/:idpedido" element={<RutaPrivada><MpPending /></RutaPrivada>} />
          <Route path="mpsuccess/:idpedido" element={<RutaPrivada><MpSuccess /></RutaPrivada>} />
        </Routes>

        <AuthHandler />
      </CartContextProvider>
    </NextUIProvider>
  );
}

export default App;