import Articulo from "./Articulo";
import PromocionDetalle from "./PromocionDetalle";
import Sucursal from "./Sucursal";

interface Promocion extends Articulo {
    fechaDesde:Date,
    fechaHasta:Date,
    horaDesde:Date,
    horaHasta:Date,
    descripcionDescuento:string,
    precioPromocional:number,
    tipoPromocion:string,
    sucursales:Sucursal[],
    promocionDetalles:PromocionDetalle[]
}

export default Promocion;