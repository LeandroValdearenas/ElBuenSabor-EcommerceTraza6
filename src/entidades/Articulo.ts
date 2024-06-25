import Base from "./Base";
import Categoria from "./Categoria";
import Imagen from "./Imagen";
import UnidadMedida from "./UnidadMedida";

interface Articulo extends Base {
    denominacion:string,
    categoria:Categoria,
    precioVenta:number,
    stockActual:number,
    unidadMedida:UnidadMedida,
    imagenes:Imagen[],
    type:string,
  }

export default Articulo;