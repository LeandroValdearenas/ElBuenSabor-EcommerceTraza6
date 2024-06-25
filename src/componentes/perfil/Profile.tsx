import { useAuth0 } from "@auth0/auth0-react";
import { ClienteService } from "../../servicios/ClienteService";
import { useEffect, useState } from "react";
import Cliente from "../../entidades/Cliente";
import './profile.css';
import CargarImagen from "../cargarImagenes/CargarImagen";
import { Button, CircularProgress, Input } from "@nextui-org/react";
import Domicilios from "../domicilios/Domicilios";
import Domicilio from "../../entidades/Domicilio";
import { useCliente } from "../../context/ClienteContext";
import { Link } from "react-router-dom";

const Profile = ({ editar = false }) => {
  const { cliente, handleReloadCliente } = useCliente();
  const [clienteNuevo, setClienteNuevo] = useState<Cliente>({
    id: 0,
    nombre: '',
    cuil: '',
    dni: '',
    usuario: { id: 0, auth0Id: '', username: '' },
    apellido: '',
    domicilios: [],
    email: '',
    fechaNacimiento: new Date(),
    imagen: { id: 0, url: '' },
    pedidos: [],
    rol: '',
    telefono: ''
  });
  const [isEditing, setIsEditing] = useState<boolean>(editar);
  const { isLoading } = useAuth0();

  const urlapi = import.meta.env.VITE_API_URL;
  const clienteService = new ClienteService(urlapi + "/clientes");

  useEffect(() => {
    if (cliente) {
      const buscarUsuarioAuth0 = async () => {
        const clienteNuevo = cliente;
        setClienteNuevo(clienteNuevo!);
      };
      buscarUsuarioAuth0();
    }
  }, [cliente]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClienteNuevo({ ...clienteNuevo, [name]: value });
  };

  const handleChangeDomicilios = (value: Domicilio[]) => {
    setClienteNuevo({ ...clienteNuevo, domicilios: value });
  };

  const handleCancelarCambios = () => {
    setIsEditing(false);
    setClienteNuevo(cliente!);
  }

  const handleSubmit = async () => {
    try {
      if (!clienteNuevo.nombre) {
        throw new Error("El nombre del cliente no puede ser vacío");
      }
      if (!clienteNuevo.apellido) {
        throw new Error("El apellido del cliente no puede ser vacío");
      }
      if (!clienteNuevo.telefono) {
        throw new Error("El teléfono del cliente no puede estar vacío");
      }
      if (!clienteNuevo.email) {
        throw new Error("El e-mail del cliente no puede estar vacío");
      }
      if (!clienteNuevo.domicilios.length) {
        throw new Error("Debe tener al menos 1 domicilio");
      }
      if (!clienteNuevo.dni || clienteNuevo.dni.length !== 8) {
        throw new Error("El DNI debe tener 8 dígitos");
      }
      if (!clienteNuevo.cuil || clienteNuevo.cuil.length !== 11) {
        throw new Error("El CUIL debe tener 11 dígitos");
      }

      await clienteService.put(clienteNuevo.id, clienteNuevo);
      localStorage.setItem('usuario', JSON.stringify(clienteNuevo));
      handleReloadCliente();

      setIsEditing(false);
    } catch (error) {
      alert(error);
    }
  };

  return (
    <>
      {isLoading ?
        <div className="w-100 d-flex justify-content-center mt-5"><CircularProgress /></div>
        :
        (cliente && (
          <div className="bg-gris d-flex justify-content-center">
            <div className="mt-1 col-6">
              <br></br>
              <div className="border rounded bg-white p-3">
                <h4 className="mb-2">Perfil</h4>
                <div className="row">
                  <div className="col-12 col-xl-7">
                    <div className="d-flex">
                      <div className="perfil-imagen-container">
                        {isEditing
                          ? <CargarImagen imagen={clienteNuevo.imagen} handleChange={(key: unknown, value: unknown) => setClienteNuevo((prevState: Cliente) => ({
                            ...prevState,
                            [key as string]: value
                          }))} />
                          : <img src={clienteNuevo.imagen.url} alt={clienteNuevo.nombre} className="perfil-imagen" />
                        }
                      </div>
                      <div className="col">
                        {isEditing ? (
                          <>
                            <Input
                              label="Nombre"
                              name="nombre"
                              value={clienteNuevo.nombre}
                              onChange={handleInputChange}
                              className="my-2"
                              fullWidth
                            />
                            <Input
                              label="Apellido"
                              name="apellido"
                              value={clienteNuevo.apellido}
                              onChange={handleInputChange}
                              className="my-2"
                              fullWidth
                            />
                            <Input
                              label="DNI"
                              name="dni"
                              value={clienteNuevo.dni}
                              onChange={handleInputChange}
                              className="my-2"
                              fullWidth
                            />
                            <Input
                              label="CUIL"
                              name="cuil"
                              value={clienteNuevo.cuil}
                              onChange={handleInputChange}
                              className="my-2"
                              fullWidth
                            />
                            <Input
                              label="Contraseña"
                              name="contraseña"
                              type="password"
                              value="************"
                              disabled
                              className="my-2"
                              fullWidth
                            />
                          </>
                        ) : (
                          <>
                            <div className="d-flex my-2">
                              <h5 className="me-3">Nombre:</h5>
                              <h5 className="fw-normal">{clienteNuevo.nombre}</h5>
                            </div>
                            <div className="d-flex my-2">
                              <h5 className="me-3">Apellido:</h5>
                              <h5 className="fw-normal">{clienteNuevo.apellido}</h5>
                            </div>
                            <div className="d-flex my-2">
                              <h5 className="me-3">DNI:</h5>
                              <h5 className="fw-normal">{clienteNuevo.dni}</h5>
                            </div>
                            <div className="d-flex my-2">
                              <h5 className="me-3">CUIL:</h5>
                              <h5 className="fw-normal">{clienteNuevo.cuil}</h5>
                            </div>
                            <div className="d-flex my-2">
                              <h5 className="me-3">Contraseña:</h5>
                              <h5 className="fw-normal">************</h5>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-xl-5">
                    <h4 className="mb-2">Contacto</h4>
                    {isEditing ? (
                      <>
                        <Input
                          label="Teléfono"
                          name="telefono"
                          value={clienteNuevo.telefono}
                          onChange={handleInputChange}
                          className="my-2"
                          fullWidth
                        />
                        <Input
                          label="E-mail"
                          name="email"
                          value={clienteNuevo.email}
                          disabled
                          className="my-2"
                          fullWidth
                        />
                      </>
                    ) : (
                      <>
                        <div className="d-flex my-2">
                          <h5 className="me-3">Teléfono:</h5>
                          <h5 className="fw-normal">{clienteNuevo.telefono}</h5>
                        </div>
                        <div className="d-flex my-2">
                          <h5 className="me-3">E-mail:</h5>
                          <h5 className="fw-normal">{clienteNuevo.email}</h5>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="border rounded bg-white p-3 my-2">
                <h4 className="mb-2">Domicilio</h4>
                {isEditing ? (
                  <Domicilios domicilios={clienteNuevo.domicilios} handleChangeDomicilios={handleChangeDomicilios} editar />
                ) : (
                  <Domicilios domicilios={clienteNuevo.domicilios} handleChangeDomicilios={handleChangeDomicilios} />
                )}
              </div>

              <div className="d-flex justify-content-between">
                <Link to={'../'} className="col-3">
                  <Button variant="solid" color="secondary" fullWidth>Volver</Button>
                </Link>
                {isEditing ? (
                  <>
                    <Button variant="solid" color="danger" className="col-3" onClick={handleCancelarCambios}>
                      Cancelar cambios
                    </Button>
                    <Button variant="solid" color="primary" className="col-3" onClick={handleSubmit}>
                      Guardar
                    </Button>
                  </>
                ) : (
                  <Button variant="solid" color="secondary" className="col-3" onClick={() => setIsEditing(true)}>
                    Modificar Datos
                  </Button>
                )}
              </div>
              <br />
            </div>
          </div>
        ))
      }
    </>
  );
};

export default Profile;