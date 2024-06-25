import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PedidoService } from "../../servicios/PedidoService";
import Pedido from "../../entidades/Pedido";
import { Estados } from "../../entidades/enums/Estados";
import { Spinner } from "@nextui-org/react";
import { useSucursales } from "../../context/SucursalesContext";

function MpPending() {
    const {idpedido} = useParams();
    const {sucursales} = useSucursales();
    const navigate = useNavigate();
    
    const urlapi = import.meta.env.VITE_API_URL;
    const pedidoService = new PedidoService(urlapi + "/pedidos");

    const buscarPedido = async () => {
        const pedido:Pedido = await pedidoService.getById(Number(idpedido));
        pedido.estado = Estados.PAGO_PENDIENTE;
        await pedidoService.put(Number(idpedido), pedido);
        navigate(`../pedidodetalle/${idpedido}`, { state: { sucursalSeleccionada:sucursales.find(s => s.id===pedido.sucursal.id) } });
    }

    useEffect(() => {
        buscarPedido();
    }, [])
    return (
    <div className="container p-4">
        <Spinner />
    </div>
    );
}

export default MpPending;