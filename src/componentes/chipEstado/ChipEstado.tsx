import { Chip } from "@nextui-org/react";
import { Estados } from "../../entidades/enums/Estados";

export default function ChipEstado ({estado} : {estado:Estados}) {
    return <Chip color={`${(estado === Estados.APROBADO || estado === Estados.TERMINADO || estado === Estados.FACTURADO) 
        ? 'success' 
        : (estado === Estados.PAGO_PENDIENTE || estado === Estados.PENDIENTE
            ? 'warning' : 'danger')}`} 
        variant="bordered">{estado}</Chip>
}