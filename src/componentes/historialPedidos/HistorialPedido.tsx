import { useState, useEffect } from 'react'
import { PedidoService } from '../../servicios/PedidoService';
import Pedido from '../../entidades/Pedido';
import Header from '../commons/header/Header';
import LoaderPage from '../loaderPage/LoaderPage';
import { format } from 'date-fns';
import ChipEstado from '../chipEstado/ChipEstado';
import { useSucursales } from '../../context/SucursalesContext';
import { useCliente } from '../../context/ClienteContext';
import { Button } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';

function HistorialPedidos() {
    const navigate = useNavigate();
  const { cliente } = useCliente();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [fechaDesde, setFechaDesde] = useState<string>(new Date(new Date().getTime() - 2592000000).toISOString().slice(0,10));
  const [fechaHasta, setFechaHasta] = useState<string>(new Date(new Date().getTime() + 2592000000).toISOString().slice(0,10));
  const { sucursalSeleccionada } = useSucursales();

  const urlapi = import.meta.env.VITE_API_URL;
  const pedidoService = new PedidoService(urlapi + "/pedidos");

  const getPedidosResto = async () => {
      const datos: Pedido[] = await pedidoService.encontrarXClienteYSucursal(cliente!.id, sucursalSeleccionada!.id, fechaDesde, fechaHasta);
      setPedidos(datos);
  };

  const handleDescargarExcel = () => {
    pedidoService.getExcelPedidos(cliente!.id, sucursalSeleccionada!.id, fechaDesde, fechaHasta);
  }

  useEffect(() => {
    if (cliente && sucursalSeleccionada)
        getPedidosResto();
  }, [fechaDesde, fechaHasta, cliente, sucursalSeleccionada]);

  return (
      <>
      {cliente 
      ?
      <>
      <Header />
      <div className='body-no-navbar'>
      <div className='mx-4'>
          <br/>
          {sucursalSeleccionada 
            ?   (<>
                <div className='d-flex mb-3'>
                    <label className='me-2'>
                        Fecha Desde:
                        <input type="date" className='form-control' value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} />
                    </label>
                    <label>
                        Fecha Hasta:
                        <input type="date" className='form-control' value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} />
                    </label>
                    <div className='ms-auto mt-auto'>
                        <a className="btn btn-lg btn-secondary" onClick={handleDescargarExcel}>Exportar a Excel</a>
                    </div>
                </div>
                
                <div className='contenido'>
                    <table className='table mx-auto width-80 text-center'>
                        <thead>
                        <tr className='table-dark'>
                            <th scope="col">
                                Pedido N°
                            </th>
                            <th scope="col">
                                Fecha
                            </th>
                            <th scope="col">
                                Total
                            </th>
                            <th scope="col">
                                Estado
                            </th>
                            <th scope="col">
                                Detalles
                            </th>
                            <th scope="col">
                                Ver detalles
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {pedidos.length > 0 && pedidos.map((pedido: Pedido) => 
                            <tr key={pedido.id}>
                                <th scope='row'>
                                    {('0000' + pedido.id).slice(-5)}
                                </th>
                                <td>
                                    {format(pedido.fechaPedido, "dd/MM/yy HH:mm")}
                                </td>
                                <td>
                                    ${pedido.total?.toLocaleString('es-AR')}
                                </td>
                                <td>
                                    <ChipEstado estado={pedido.estado} />
                                </td>
                                <td>
                                    {pedido.detallePedidos.length} {pedido.detallePedidos.length == 1 ? "detalle" : "detalles"}
                                </td>
                                <td>
                                    <div style={{ marginBottom: 10 }} className="ms-2 mt-auto col d-grid text-decoration-none">
                                        <Button onClick={() => navigate(`../pedidodetalle/${pedido.id}`, { state: { sucursalSeleccionada } })}>Ver detalles</Button>
                                    </div>
                                </td>
                                
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
                </>)
            :   (<LoaderPage />)}
      </div>
      </div>
      </>
      : <LoaderPage />
      }
      </>
  );
}
    
export default HistorialPedidos