import { Navbar, Dropdown, NavbarBrand, NavbarContent, DropdownTrigger, DropdownMenu, DropdownItem, Button, NavbarItem, NavbarMenuToggle, Avatar, DropdownSection } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from '../../icons';
import SignUpButton from './SignUpButton';
import LoginButton from './LoginButton';
import { useAuth0 } from '@auth0/auth0-react';
import './header.css';
import { useSucursales } from '../../../context/SucursalesContext';
import { useEmpresas } from '../../../context/EmpresasContext';
import { useCliente } from '../../../context/ClienteContext';
import Sucursal from '../../../entidades/Sucursal';
import { useEffect, useState } from 'react';

const Header = () => {
  const { logout } = useAuth0();
  const { empresaSeleccionada } = useEmpresas();
  const { cliente } = useCliente();
  const { sucursalSeleccionada, sucursales, handleChangeSucursal } = useSucursales();
  const [sucursalesFiltradas, setSucursalesFiltradas] = useState<Sucursal[]>([]);
  const navigate = useNavigate();
  
  const cerrarSesion = async () => {
    localStorage.setItem('usuario', "");
    localStorage.removeItem('usuario');
    logout({logoutParams : { returnTo: window.location.origin}});
  }
  
  useEffect(() => {
    if (sucursales.length)
      setSucursalesFiltradas(sucursales.filter(sucursal => !sucursal.eliminado));
  }, [sucursales])

  return (
    <Navbar>
      <NavbarContent as="div">
        <NavbarMenuToggle
          aria-label={true ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand className='align-baseline'>
          <div className='me-1' style={{height:"20px", width:"20px"}}>
            <img src='/buen-sabor.svg' />
          </div>
          <a className="text-decoration-none" href='#' onClick={() => navigate(`/home`, { state: { sucursalSeleccionada }, relative:'path' })}>
            <p className="font-bold text-inherit my-auto">
              {empresaSeleccionada?.nombre.toUpperCase()}
            </p>
          </a>
        </NavbarBrand>
      </NavbarContent>
      {sucursalSeleccionada &&
      <NavbarContent as="div" className="hidden sm:flex gap-4" justify="center">
        <Dropdown>
          <DropdownTrigger>
          <Button 
            variant="light"
            color='primary'
            className="capitalize w-100"
            radius="sm"
            endContent={<ChevronDown fill="currentColor" size={16} />}
            isDisabled={window.location.pathname === '/checkout'}
          >
            {sucursalSeleccionada.nombre}, Abierto: {(sucursalSeleccionada.horarios.find(horario => horario.diaSemana === ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'][new Date().getDay()]) ?? {horarioDetalles:[]}).horarioDetalles
              .sort((a,b) => new Date('2000-01-01T'+a.horaInicio).getTime() - new Date('2000-01-01T'+b.horaInicio).getTime())
              .map(hd => `(${hd.horaInicio.toString().slice(0, -3)} a ${hd.horaFin.toString().slice(0, -3)})`).join(' y ') }
          </Button>
          </DropdownTrigger>
          <DropdownMenu variant='flat' className="w-[340px]">
            {sucursalesFiltradas.map(sucursal =>
              <DropdownItem 
                key={sucursal.id}
                description={`${sucursal.domicilio.calle} ${sucursal.domicilio.numero}, ${sucursal.domicilio.localidad.nombre}`}
                startContent={<img className='w-10 h-10 rounded' src={sucursal.imagen.url}/>}
                onPress={() => {handleChangeSucursal(sucursal.id)}}
                className={'sin-link' + (sucursalSeleccionada.id === sucursal.id ? ' selected' : '')}
              >
                {sucursal.nombre}
              </DropdownItem>
            )}
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
      }
      <NavbarContent as="div" justify="end">
      { cliente
        ? <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform custom-avatar"
              color="secondary"
              name={cliente.nombre + " " + cliente.apellido}
              size="sm"
              src={cliente.imagen?.url}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat" disabledKeys={["profile"]}>
            <DropdownSection showDivider> 
              <DropdownItem key="profile">
                <p className="font-semibold my-0">{cliente.nombre} {cliente.apellido}</p>
                <p className="font-semibold my-0">{cliente.email}</p>
              </DropdownItem>
            </DropdownSection>
            <DropdownItem key="settings" onClick={()=> navigate(`/perfil`)}>Mi cuenta</DropdownItem>
            <DropdownItem key="team_settings" onClick={()=> navigate(`/pedidos`)}>Historial de pedidos</DropdownItem>
            <DropdownItem key="logout" color="danger" onClick={cerrarSesion}>
                Cerrar sesión
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        : <>
          <NavbarItem>
            <LoginButton />
          </NavbarItem>
          <NavbarItem>
            <SignUpButton />
          </NavbarItem>
          </>
      }
      </NavbarContent>
    </Navbar>
  );
};

export default Header;