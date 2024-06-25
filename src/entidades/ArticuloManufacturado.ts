import ArticuloManufacturadoDetalle  from "./ArticuloManufacturadoDetalle";
import Articulo from "./Articulo";

interface ArticuloManufacturado extends Articulo {
    resumen:string,
    descripcion:string,
    tiempoEstimadoMinutos:number,
    articuloManufacturadoDetalles:ArticuloManufacturadoDetalle[],
    preparacion:string,
    precioCosto:number
}

export default ArticuloManufacturado;