import Base from "./Base";
import Localidad from "./Localidad";

interface Domicilio extends Base {
    calle:string,
    numero:number,
    cp:number,
    localidad:Localidad
}

export default Domicilio;