import { useLocation, useNavigate } from "react-router-dom";
import Header from "../commons/header/Header";
import PedidoMpButton from "../mp/PedidoMpButton";
import CarritoPedido from "./CarritoPedido";
import { Button, Tab, Tabs } from "@nextui-org/react";
import Pedido from "../../entidades/Pedido";
import { useEffect, useState } from "react";
import { FormaPago } from "../../entidades/enums/FormaPago";
import { TipoEnvio } from "../../entidades/enums/TipoEnvio";
import Cliente from "../../entidades/Cliente";
import { ClienteService } from "../../servicios/ClienteService";
import { useAuth0 } from "@auth0/auth0-react";
import DomicilioSeleccionado from "../domicilios/DomicilioSeleccionado";
import Domicilio from "../../entidades/Domicilio";
import { useSucursales } from "../../context/SucursalesContext";
import LoaderPage from "../loaderPage/LoaderPage";
import Promocion from "../../entidades/Promocion";
import { useCliente } from "../../context/ClienteContext";

function CarritoCheckout() {
    const location = useLocation();
    const navigate = useNavigate();
    const [cliente, setCliente] = useState<Cliente | undefined>(undefined);
    const [domicilioSeleccionado, setDomicilioSeleccionado] = useState<Domicilio | undefined>(undefined);
    const [cantArticulos, setCantArticulos] = useState(0);
    const [subtotal, setSubtotal] = useState(0);
    const [descuentos, setDescuentos] = useState(0);
    const [total, setTotal] = useState(0);
    const [pedido, setPedido] = useState<Pedido>(location.state?.pedido || {});
    const { sucursalSeleccionada } = useSucursales();
    const { isAuthenticated, user } = useAuth0();
    const { handleReloadCliente } = useCliente();

    const urlapi = import.meta.env.VITE_API_URL;
    const clienteService = new ClienteService(urlapi + "/clientes");

    const handleChangeTipoEnvio = (valor: string) => {
        const tipoEnvio:TipoEnvio = valor === "1" ? TipoEnvio.TakeAway : TipoEnvio.Delivery;
        setPedido({...pedido, tipoEnvio:tipoEnvio, formaPago:FormaPago.MercadoPago});
    };

    const handleChangeFormaPago = (valor: string) => {
        const formaPago:FormaPago = valor === "1" ? FormaPago.Efectivo : FormaPago.MercadoPago;
        setPedido({...pedido, formaPago:formaPago});
    };

    const handleChangeDomicilios = async (value: Domicilio[]) => {
        const clienteNuevo = { ...cliente!, domicilios:value };
        await clienteService.put(clienteNuevo.id, clienteNuevo);
        
        const usuario = await clienteService.buscarXUsuarioAuth0(clienteNuevo.usuario.auth0Id);
        localStorage.setItem('usuario', JSON.stringify(usuario));
        handleReloadCliente();

        setCliente(usuario);
    };

    const handleSeleccionarDomicilio = (value: Domicilio) => {
        setDomicilioSeleccionado(value);
    };

    useEffect(() => {
        if (domicilioSeleccionado)
            setPedido((previo) => ({...previo, domicilio:domicilioSeleccionado} as Pedido))
    }, [domicilioSeleccionado]);

    useEffect(() => {
        if (isAuthenticated) {
        const buscarUsuarioAuth0 = async () => {
            const cliente = await clienteService.buscarXUsuarioAuth0(user?.sub);
            setCliente(cliente);
            setDomicilioSeleccionado(cliente.domicilios[0]);
        };
        buscarUsuarioAuth0();
        }
    }, [isAuthenticated]);

    useEffect(() => {
        const subtotal = pedido.detallePedidos.map(d => (d.articulo.precioVenta ?? (d.articulo as Promocion).precioPromocional) * d.cantidad).reduce((a,b) => a+b, 0);
        const descuentos = pedido.formaPago === FormaPago.Efectivo ? subtotal * 0.1 : 0;
        setCantArticulos(pedido.detallePedidos.map(d => d.cantidad).reduce((a,b) => a+b, 0));
        setSubtotal(subtotal);
        setDescuentos(descuentos);
        setTotal(subtotal - descuentos);
    }, [pedido]);

    return (
        <>
        <Header />
        <div className="mt-4">
        { sucursalSeleccionada 
        ?   (<div className="container p-4 mx-auto card text-center">
                <h3 className="text-start mb-2">
                    <b>Tu pedido</b>
                </h3>
                <div className="row mb-2">
                    <div className="col-12 col-md-6 mb-2">
                        <CarritoPedido pedido={pedido}/>
                    </div>
                    <div className="col mb-2 d-flex flex-column border rounded">
                        <div className="h-50">
                        <div className="container">
                            <div className="d-flex mt-4 justify-content-between">
                                <p className="fs-5">{cantArticulos} artículo{`${cantArticulos > 1 ? 's' : ''}`}:</p>
                                <p className="fs-5">${subtotal.toLocaleString('es-AR')}</p>
                            </div>
                            
                            { descuentos > 0 &&
                            <div className="d-flex justify-content-between">
                                <p className="fs-5">Descuentos: </p>
                                <p className="fs-5">${descuentos.toLocaleString('es-AR')}</p>
                            </div> }

                            <div className="d-flex mb-2 justify-content-between">
                                <p className="fs-5 fw-bold">Total: </p>
                                <p className="fs-5 fw-bold">${total.toLocaleString('es-AR')}</p>
                            </div>
                        </div>
                        <hr className="mb-2" />
                        <Tabs aria-label="TipoEnvio"
                            size="lg"
                            className="mb-2"
                            fullWidth
                            selectedKey={pedido.tipoEnvio === TipoEnvio.TakeAway ? "1" : "2"}
                            onSelectionChange={(e) => handleChangeTipoEnvio(e.toString())}>
                            <Tab key="1" title="Retiro por el Local"/>
                            <Tab key="2" title="Envío a Domicilio"/>
                        </Tabs>
                        {pedido.tipoEnvio === TipoEnvio.Delivery && cliente
                        &&  <>
                            <hr className="my-2" />
                            <DomicilioSeleccionado domicilios={cliente?.domicilios} domicilio={domicilioSeleccionado} handleChangeDomicilios={handleChangeDomicilios} handleSeleccionarDomicilio={handleSeleccionarDomicilio} />
                            </>
                        }
                        <hr className="mb-2" />
                        <Tabs aria-label="FormaPago"
                            size="lg"      
                            fullWidth
                            selectedKey={pedido.formaPago === FormaPago.Efectivo ? "1" : "2"}
                            onSelectionChange={(e) => handleChangeFormaPago(e.toString())}
                            disabledKeys={pedido.tipoEnvio === TipoEnvio.Delivery ? ["1"] : []}>
                            <Tab key="1" title="Efectivo"/>
                            <Tab key="2" title="MercadoPago"/>
                        </Tabs>
                        <hr className="my-2" />
                        </div>
                        <div className="mt-auto">
                            {!domicilioSeleccionado && (pedido.tipoEnvio === TipoEnvio.Delivery)
                                ? <h5 className="my-2 text-danger">Ingrese un domicilio.</h5>
                                : <PedidoMpButton pedido={pedido}/>
                            }
                        </div>
                    </div>
                </div>
                <div className="me-auto">
                    <Button onClick={() => navigate('../home', { state: { pedido, sucursalSeleccionada } })}>Seguir comprando</Button>
                </div>
            </div>)
        :   (<LoaderPage />)}
        </div>
        </>
    );
}

export default CarritoCheckout;
