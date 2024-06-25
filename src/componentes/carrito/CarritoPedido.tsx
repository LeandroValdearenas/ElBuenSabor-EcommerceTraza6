import Pedido from "../../entidades/Pedido";
import DetallePedido from "../../entidades/DetallePedido";
import { ScrollShadow } from "@nextui-org/react";
import './carritoPedido.css';
import Promocion from "../../entidades/Promocion";

const CartItemSmall = ({ item }: { item: DetallePedido }) => {
    const imagenUrl = item.articulo.imagenes.length > 0 ? item.articulo.imagenes[0].url : 'https://static.vecteezy.com/system/resources/previews/005/007/528/non_2x/restaurant-food-kitchen-line-icon-illustration-logo-template-suitable-for-many-purposes-free-vector.jpg';
    return (
      <div className='d-flex justify-content-end mb-2 border-bottom'>
        <div className='col-2 m-2'>
          <img src={`${imagenUrl}`} alt={imagenUrl} />
        </div>
        <div className="col m-2 me-auto">
          <h5 className="card-title text-start mb-2">{(item.articulo as Promocion).precioPromocional !== undefined ? `Promoción: "${item.articulo.denominacion}"` : item.articulo.denominacion}</h5>
          <div className='d-flex justify-content-between'>
            <p className="card-text">${(item.articulo.precioVenta ?? (item.articulo as Promocion).precioPromocional).toLocaleString('es-AR')}</p>
          </div>
        </div>
        <div className="col-2 m-2 text-end">
          <h5 className="card-title mb-2">${(item.cantidad * (item.articulo.precioVenta ?? (item.articulo as Promocion).precioPromocional)).toLocaleString('es-AR')}</h5>
          <div className="px-2 py-1 bg-dark text-light rounded">
            <p className="card-text">{item.cantidad}</p>
          </div>
        </div>
      </div>
    );
};

export default function CarritoPedido({pedido}:{pedido:Pedido}) {
    return (
        <div className="border p-2 rounded contenido">
            <ScrollShadow hideScrollBar className="h-[300px]">
                {pedido.detallePedidos.map((detalle: DetallePedido) => (
                    <CartItemSmall key={detalle.articulo.id} item={detalle} />
                ))}
            </ScrollShadow>
        </div>
    );
}