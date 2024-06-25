import Base from "./Base";
import Cliente from "./Cliente";
import DetallePedido from "./DetallePedido";
import Domicilio from "./Domicilio";
import Empleado from "./Empleado";
import Sucursal from "./Sucursal";
import { Estados } from "./enums/Estados";
import { FormaPago } from "./enums/FormaPago";
import { TipoEnvio } from "./enums/TipoEnvio";

interface Pedido extends Base {
    horaEstimadaFinalizacion:Date,
    total: number,
    totalCosto: number,
    estado: Estados,
    tipoEnvio: TipoEnvio,
    formaPago: FormaPago,
    fechaPedido:Date,
    domicilio:Domicilio,
    sucursal:Sucursal,
    cliente:Cliente,
    empleado:Empleado,
    detallePedidos:DetallePedido[]
}

export default Pedido