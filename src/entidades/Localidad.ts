import Base from "./Base";
import Provincia from "./Provincia";

interface Localidad extends Base {
    nombre:string,
    provincia:Provincia
}

export default Localidad;