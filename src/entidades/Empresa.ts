import Base from "./Base";
import Imagen from "./Imagen";
import Sucursal from "./Sucursal";

interface Empresa extends Base {
    nombre:string,
    razonSocial:string,
    cuil:number,
    imagen:Imagen,
    sucursales:Sucursal[],
    domain:string
}

export default Empresa;