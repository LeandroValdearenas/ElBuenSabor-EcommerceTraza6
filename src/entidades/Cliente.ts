import Base from "./Base";
import Domicilio from "./Domicilio";
import Imagen from "./Imagen";
import Pedido from "./Pedido";
import UsuarioCliente from "./UsuarioCliente";

interface Cliente extends Base {
    rol:string,
    nombre:string,
    apellido:string,
    dni:string,
    cuil:string,
    telefono:string,
    email:string,
    fechaNacimiento:Date,
    imagen:Imagen,
    domicilios:Domicilio[],
    usuario:UsuarioCliente,
    pedidos:Pedido[]
}

export default Cliente;