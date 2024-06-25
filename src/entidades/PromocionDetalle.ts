import Articulo from "./Articulo";
import Base from "./Base";

interface PromocionDetalle extends Base {
    cantidad:number,
    articulo:Articulo
}

export default PromocionDetalle;