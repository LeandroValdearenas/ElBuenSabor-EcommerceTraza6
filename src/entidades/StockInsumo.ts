import Base from "./Base";
import Sucursal from "./Sucursal";

interface StockInsumo extends Base {
    stockActual:number,
    stockMinimo:number,
    stockMaximo:number,
    sucursal:Sucursal
}

export default StockInsumo;