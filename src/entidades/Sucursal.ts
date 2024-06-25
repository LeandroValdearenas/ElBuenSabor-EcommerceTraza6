import Base from "./Base";
import Domicilio from "./Domicilio";
import Empresa from "./Empresa";
import HorarioSucursal from "./HorarioSucursal";
import Imagen from "./Imagen";

interface Sucursal extends Base {
    nombre:string,
    domicilio:Domicilio,
    casaMatriz:boolean,
    imagen:Imagen,
    empresa?:Empresa,
    eliminado:boolean,
    horarios:HorarioSucursal[]
}

export default Sucursal;