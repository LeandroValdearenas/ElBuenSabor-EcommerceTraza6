import { useState } from 'react';
import { Button, Card, CardHeader, CardBody, CardFooter, ScrollShadow } from '@nextui-org/react';
import { useCart } from '../../context/CartContext';
import DetallePedido from '../../entidades/DetallePedido';
import AddRemove from '../addRemove/AddRemove';
import './carrito.css';
import { useNavigate } from 'react-router-dom';
import Sucursal from '../../entidades/Sucursal';
import Empresa from '../../entidades/Empresa';
import Imagen from '../../entidades/Imagen';
import { useAuth0 } from '@auth0/auth0-react';
import { useSucursales } from '../../context/SucursalesContext';
import { useEmpresas } from '../../context/EmpresasContext';
import { verificarHoraSucursal } from './verificarHoraSucursal';
import Promocion from '../../entidades/Promocion';

const CartItem = ({ item }: { item: DetallePedido }) => {
  const imagenUrl = item.articulo.imagenes.length > 0 ? item.articulo.imagenes[0].url : 'https://static.vecteezy.com/system/resources/previews/005/007/528/non_2x/restaurant-food-kitchen-line-icon-illustration-logo-template-suitable-for-many-purposes-free-vector.jpg';
  return (
    <div className='d-flex justify-content-end mb-2'>
      <div className='carrito-producto'>
        <img src={`${imagenUrl}`} alt={imagenUrl} />
      </div>
      <div>
        <h5 className="card-title mb-2">{(item.articulo as Promocion).precioPromocional !== undefined ? `Promoción: "${item.articulo.denominacion}"` : item.articulo.denominacion}</h5>
        <div className='d-flex justify-content-between'>
          <p className="card-text">${(item.articulo.precioVenta ?? (item.articulo as Promocion).precioPromocional).toLocaleString('es-AR')}</p>
          <div className='ms-4'>
            <AddRemove articulo={item.articulo} small />
          </div>
        </div>
      </div>
    </div>
  );
};

const Carrito = () => {
  const [ isOpen, setIsOpen ] = useState(true);
  const { empresaSeleccionada } = useEmpresas();
  const { sucursalSeleccionada } = useSucursales();
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const { cart, clearCart, sendOrder } = useCart();
  const navigate = useNavigate();

  const save = async () => {
    if (isAuthenticated) {
      if (sucursalSeleccionada) {
        if (verificarHoraSucursal(sucursalSeleccionada.horarios))
          return alert("La sucursal se encuentra fuera de servicio. Vuelva más tarde!");
        const pedido = await sendOrder();
        pedido.sucursal = { id: sucursalSeleccionada?.id, empresa: {nombre:empresaSeleccionada?.nombre, imagen:{url:"https://i.imgur.com/zPY2PZ1.png"} as Imagen} as Empresa } as Sucursal;
        navigate('/checkout', { state: { pedido, sucursalSeleccionada } });
      }
    }
    else {
      loginWithRedirect({
        appState: {
            returnTo: window.location.pathname,
        },
      })
    }
  };

  return (
    <>
    {!isLoading 
    && sucursalSeleccionada 
    &&
    (<div className='carrito'>
      {cart.length > 0 && (
        <Card>
          <CardHeader className='bg-light d-flex justify-content-between align-items-center'>
            <div>
              Carrito de compras
            </div>
            <Button color="primary" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? 'Minimizar Carrito' : 'Abrir Carrito'}
            </Button>
          </CardHeader>
          <div className={`carrito-contenedor ${isOpen ? 'open' : 'closed'}`}>
            {cart.length > 0 && (
              <>
                <CardBody>

                  <ScrollShadow hideScrollBar className="h-[300px]">
                    {cart.map((detalle: DetallePedido) => (
                      <CartItem key={detalle.articulo.id} item={detalle} />
                    ))}
                  </ScrollShadow>

                  <div>
                    <div>Subtotal:</div>
                    <div>${cart.reduce((suma, detalle) => suma + (detalle.articulo.precioVenta ?? (detalle.articulo as Promocion).precioPromocional) * detalle.cantidad, 0).toLocaleString('es-AR')}</div>
                  </div>
                  
                </CardBody>
                <CardFooter className='justify-content-between'>
                  <Button color="danger" onClick={clearCart} className='me-2'>
                    Limpiar todo
                  </Button>
                  <Button color="success" onClick={save}>
                    Continuar
                  </Button>
                </CardFooter>
              </>
            )}
          </div>
        </Card>
      )}
    </div>)
    }
    </>
  );
};

export default Carrito;