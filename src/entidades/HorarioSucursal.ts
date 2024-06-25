import Base from "./Base";
import HorarioDetalleSucursal from "./HorarioDetalleSucursal";
import Dia from "./enums/Dia";

interface HorarioSucursal extends Base {
    diaSemana: Dia;
    horarioDetalles:HorarioDetalleSucursal[];
}

export default HorarioSucursal;