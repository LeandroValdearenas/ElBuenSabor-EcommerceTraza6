import { useState, useEffect } from 'react';
import { PedidoService } from '../../servicios/PedidoService';
import Pedido from '../../entidades/Pedido';
import "./mp.css";
import { MercadoPagoService } from '../../servicios/MercadoPagoService';
import PreferenceMP from '../../entidades/mp/PreferenceMP';
import Sucursal from '../../entidades/Sucursal';
import { Button, Spinner } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import MpCheckout from './MpCheckout';
import { FormaPago } from '../../entidades/enums/FormaPago';
import { Estados } from '../../entidades/enums/Estados';
import { TipoEnvio } from '../../entidades/enums/TipoEnvio';
import { useSucursales } from '../../context/SucursalesContext';

function PedidoMpButton ({pedido} : {pedido:Pedido}) {
    const [idPreference, setIdPreference] = useState<string>('');
    const [enviando, setEnviando] = useState<boolean>(false);
    const {sucursalSeleccionada} = useSucursales();
    const navigate = useNavigate();

    const urlapi = import.meta.env.VITE_API_URL;
    const pedidoService = new PedidoService(urlapi + "/pedidos");
    const mpService = new MercadoPagoService(urlapi + "/mp");

    useEffect(() => {
        setEnviando(false);
        setIdPreference('');
    }, [pedido]);

    const save = async () => {
        setEnviando(true);
        try {
            pedido.estado = (pedido.formaPago === FormaPago.Efectivo) ? Estados.PENDIENTE : Estados.PAGO_PENDIENTE;
            if (pedido.tipoEnvio === TipoEnvio.TakeAway && sucursalSeleccionada?.domicilio)
                pedido.domicilio = sucursalSeleccionada?.domicilio;
            const savedPedido = await pedidoService.post(pedido);
            if (pedido.formaPago === FormaPago.MercadoPago)
                await getPreferenceMP(savedPedido.id!, savedPedido.total!, savedPedido.sucursal);
            else
                navigate(`../pedidodetalle/${savedPedido.id}`);
        } catch (error) {
            console.error('Error al guardar el pedido:', error);
            setEnviando(false);
            setIdPreference('');
        }
    }
    
    const getPreferenceMP = async (pedidoId:number, montoCarrito:number, sucursal:Sucursal) => {
        try {
            const response: PreferenceMP = await mpService.createPreferenceMP({id: pedidoId, total: montoCarrito, sucursal: sucursal} as Pedido);
            if(response) {
                setIdPreference(response.id);
                setEnviando(false);
            }
        } catch (error) {
            console.error('Error al crear la preferencia de MP:', error);
            setEnviando(false);
            setIdPreference('');
        }
    }
    
    return (
        <div className='mb-3'>
            <div className='row mx-0 justify-content-center' hidden={enviando || idPreference !== ''}>
                <Button className='btn' color='primary' onClick={save} disabled={enviando}>Generar el pedido</Button>
            </div>
            {enviando 
                ? <Spinner color='success' />
                : (pedido.formaPago === FormaPago.MercadoPago 
                    &&  <MpCheckout idPreference={idPreference} />)
            }
        </div>
    );
}

export default PedidoMpButton;