import Base from "./Base";
import Sucursal from "./Sucursal";

interface StockManufacturado extends Base {
    stockActual:number,
    stockMinimo:number,
    sucursal:Sucursal
}

export default StockManufacturado;