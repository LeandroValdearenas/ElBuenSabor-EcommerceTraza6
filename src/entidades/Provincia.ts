import Base from "./Base";
import Pais from "./Pais";

interface Provincia extends Base {
    nombre:string,
    pais:Pais
}

export default Provincia;