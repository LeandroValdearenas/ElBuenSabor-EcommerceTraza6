import { useState, useEffect } from 'react'
import { PedidoService } from '../../servicios/PedidoService';
import Pedido from '../../entidades/Pedido';
import { useNavigate, useParams } from 'react-router-dom';
import TablePedido from './TablePedido';
import Header from '../commons/header/Header';
import { Button } from '@nextui-org/react';
import MpCheckout from '../mp/MpCheckout';
import { Estados } from '../../entidades/enums/Estados';
import { MercadoPagoService } from '../../servicios/MercadoPagoService';
import Empresa from '../../entidades/Empresa';
import Imagen from '../../entidades/Imagen';
import { FormaPago } from '../../entidades/enums/FormaPago';
import ChipEstado from '../chipEstado/ChipEstado';
import { format } from 'date-fns';
import LoaderPage from '../loaderPage/LoaderPage';
import { useSucursales } from '../../context/SucursalesContext';
import { useEmpresas } from '../../context/EmpresasContext';
import { TipoEnvio } from '../../entidades/enums/TipoEnvio';

function PantallaDetallePedido() {
    const navigate = useNavigate();
    const [idPreference, setIdPreference] = useState<string>('');
    const {idpedido} = useParams();
    const { empresaSeleccionada } = useEmpresas();
    const { sucursalSeleccionada } = useSucursales();
    const [pedido, setPedido] = useState<Pedido | undefined>(undefined);

    const urlapi = import.meta.env.VITE_API_URL;
    const pedidoService = new PedidoService(urlapi + "/pedidos");
    const mpService = new MercadoPagoService(`${urlapi}/mp`);
    
    const getPedidoResto =  async (id: number) => {
      const datos:Pedido = await pedidoService.getById(id);
      datos.detallePedidos.sort((a, b) => (a.articulo.id < b.articulo.id ? -1 : 1));
      setPedido(datos);
      if (datos && datos.formaPago === FormaPago.MercadoPago && (datos.estado === Estados.PAGO_PENDIENTE || datos.estado === Estados.PAGO_RECHAZADO)) {
        await getPreferenceMP(datos.id, datos.total!);
      }
    }

    const getPreferenceMP = async (pedidoId: number, montoCarrito: number) => {
      try {
          const response = await mpService.createPreferenceMP({
              id: pedidoId,
              sucursal: { id: sucursalSeleccionada!.id, empresa: {nombre: empresaSeleccionada?.nombre, imagen:{url:"https://i.imgur.com/zPY2PZ1.png"} as Imagen} as Empresa },
              total: montoCarrito
          } as Pedido);
          if (response && response.id) {
              setIdPreference(response.id);
          }
      } catch (error) {
          console.error('Error al crear la preferencia de MP:', error);
      }
    };

    useEffect(() => { 
      if (idpedido && empresaSeleccionada && sucursalSeleccionada && !idPreference) {
        getPedidoResto(Number(idpedido));
      }
    }, [idpedido, sucursalSeleccionada, empresaSeleccionada]);

    return (
        <>
        <Header />
        { pedido 
          ? (<div className='m-4 card p-4 bg-light'>
              <div className='row justify-content-between'>
                
                <div className='col-12 d-flex border-bottom justify-content-center'>
                  <h5 className='text-center pb-2 me-4'>PEDIDO N° {('0000' + pedido.id).slice(-5)}</h5>
                  <div className='mb-2'>
                    <ChipEstado estado={pedido.estado} />
                  </div>
                </div>
                <div className='col-9 row ms-3'>
                  <h6 className='col-6'>Fecha: {format(pedido.fechaPedido, "dd/MM/yy HH:mm")}</h6>
                  <h6 className='col-6'>Hora estimada: {pedido.horaEstimadaFinalizacion.toString()}</h6>
                  <h6 className='col-6'>Tipo de envío: {pedido.tipoEnvio}</h6>
                  <h6 className='col-6'>Forma de pago: {pedido.formaPago}</h6>
                  {pedido.tipoEnvio === TipoEnvio.Delivery &&
                    <h6 className='col-6'>Domicilio: {pedido.domicilio.calle} {pedido.domicilio.numero}, {pedido.domicilio.localidad.nombre}</h6>
                  }
                </div>
                <div className="ms-2 mt-auto col d-grid text-decoration-none">
                    <Button onClick={() => navigate('../pedidos', { state: { sucursalSeleccionada } })}>Volver</Button>
                </div>
              </div>
              <br/>

              <TablePedido pedido={pedido}/>
              {idPreference &&
                <MpCheckout idPreference={idPreference} />
              }
            </div>)

          : (<LoaderPage />)}
        </>
      )
}
    
export default PantallaDetallePedido