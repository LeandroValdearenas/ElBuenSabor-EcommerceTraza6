import ArticuloInsumo from "./ArticuloInsumo";
import Base from "./Base";

interface ArticuloManufacturadoDetalle extends Base {
    cantidad:number,
    articuloInsumo:ArticuloInsumo
}

export default ArticuloManufacturadoDetalle;