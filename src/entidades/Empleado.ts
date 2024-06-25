import Base from "./Base";
import Domicilio from "./Domicilio";
import Imagen from "./Imagen";
import Sucursal from "./Sucursal";

interface Empleado extends Base {
    rol:string,
    domicilio:Domicilio,
    nombre:string,
    apellido:string,
    telefono:string,
    email:string,
    fechaNacimiento:Date,
    imagen:Imagen,
    sucursal:Sucursal
}

export default Empleado;