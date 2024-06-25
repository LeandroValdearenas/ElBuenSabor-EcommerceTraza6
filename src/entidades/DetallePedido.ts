import Articulo from "./Articulo";

interface DetallePedido {
    articulo: Articulo;
    cantidad: number;
    subTotal: number;
    id?: number;
    promocion?: number;
  }
  
  export default DetallePedido;