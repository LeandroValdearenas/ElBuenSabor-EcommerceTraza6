import Articulo from "./Articulo";
import StockInsumo from "./StockInsumo";

interface ArticuloInsumo extends Articulo {
    descripcion:string,
    stockMinimo?:number,
    precioCompra:number,
    esParaElaborar:boolean,
    stocksInsumo?:StockInsumo[]
  }

export default ArticuloInsumo;