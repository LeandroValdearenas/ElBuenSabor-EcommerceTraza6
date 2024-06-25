import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import ArticuloManufacturado from '../entidades/ArticuloManufacturado';
import ArticuloInsumo from '../entidades/ArticuloInsumo';
import DetallePedido from '../entidades/DetallePedido';
import Pedido from '../entidades/Pedido';
import { useAuth0 } from '@auth0/auth0-react';
import { ClienteService } from '../servicios/ClienteService';
import Cliente from '../entidades/Cliente';
import { Estados } from '../entidades/enums/Estados';
import { TipoEnvio } from '../entidades/enums/TipoEnvio';
import { FormaPago } from '../entidades/enums/FormaPago';
import { useSucursales } from './SucursalesContext';
import { verificarHoraSucursal } from '../componentes/carrito/verificarHoraSucursal';
import Promocion from '../entidades/Promocion';
import { useLocation } from 'react-router-dom';
import Articulo from '../entidades/Articulo';

interface CartContextType {
  cart: DetallePedido[];
  total: number;
  addCart: (articulo: Articulo) => void;
  removeItemCart: (articulo: Articulo) => void;
  clearCart: () => void;
  sendOrder: () => Promise<Pedido>;
  setSelectedDetalle: (id: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CartContextProvider = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const [cart, setCart] = useState<DetallePedido[]>(location.state?.pedido?.detallePedidos || []);
  const [total, setTotal] = useState<number>(0);
  const [, setSelectedDetalle] = useState<number | null>(null);
  const { sucursalSeleccionada } = useSucursales();
  const { user } = useAuth0();

  const urlapi = import.meta.env.VITE_API_URL;
  const clienteService = new ClienteService(urlapi + "/clientes");

  const addCart = (articulo: Articulo) => {
    if (sucursalSeleccionada) {
      if (verificarHoraSucursal(sucursalSeleccionada.horarios))
        return alert("La sucursal se encuentra fuera de servicio. Vuelva más tarde!");

      setCart(prevCart => {
        const item = prevCart.find(item => item.articulo.id === articulo.id);
        if (item) {
          return prevCart.map(item =>
            item.articulo.id === articulo.id
              ? { ...item, cantidad: item.cantidad + 1, subTotal: (item.cantidad + 1) * item.articulo.precioVenta ?? (item.articulo as Promocion).precioPromocional }
              : item
            );
          } else {
            articulo.type = (articulo as ArticuloInsumo).esParaElaborar !== undefined ? 'insumo' : (articulo as ArticuloManufacturado).articuloManufacturadoDetalles !== undefined ? 'manufacturado' : 'promocion';
            return [
            ...prevCart,
            { articulo, cantidad: 1, subTotal: articulo.precioVenta ?? (articulo as Promocion).precioPromocional }
          ];
        }
      });
    }
  }

  const removeItemCart = (articulo: Articulo) => {
      setCart(prevCart => {
        const item = prevCart.find(item => item.articulo.id === articulo.id);
        if (item) {
          if (item.cantidad > 1) {
            return prevCart.map(item =>
              item.articulo.id === articulo.id
                ? { ...item, cantidad: item.cantidad - 1, subTotal: (item.cantidad - 1) * item.articulo.precioVenta ?? (item.articulo as Promocion).precioPromocional }
                : item
            );
          } else {
            return prevCart.filter(item => item.articulo.id !== articulo.id);
          }
        }
        return prevCart;
      });
  };

  const clearCart = () => setCart([]);

  const sendOrder = async () => {
    const cliente = await clienteService.buscarXUsuarioAuth0(user?.sub?.replace('auth0|', ''));
    const pedido: Pedido = {} as Pedido;
    pedido.cliente = {id: cliente.id, nombre: cliente.nombre, apellido: cliente.apellido, telefono: cliente.telefono, email: cliente.email} as Cliente;
    pedido.domicilio = cliente.domicilios[0];
    pedido.formaPago = FormaPago.Efectivo;
    pedido.estado = Estados.PENDIENTE;
    pedido.tipoEnvio = TipoEnvio.TakeAway;
    pedido.detallePedidos = cart;
    clearCart();
    return pedido;
  };

  useEffect(() => {
    // Calcular el total
    const newTotal = cart.reduce((sum, item) => sum + item.subTotal, 0);
    if (newTotal !== total) {
      setTotal(newTotal);
    }
  }, [cart]);

  useEffect(() => {
    if (location.state?.pedido?.detallePedidos !== cart) {
      setCart(location.state?.pedido?.detallePedidos || []);
    }
  }, [location.state?.pedido]);

  return (
    <CartContext.Provider value={{ cart, total, addCart, removeItemCart, clearCart, sendOrder, setSelectedDetalle }}>
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartContextProvider');
  }
  return context;
};

export { CartContextProvider, useCart };
