import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { ClienteService } from "../../servicios/ClienteService";
import Cliente from "../../entidades/Cliente";
import LoaderPage from "../loaderPage/LoaderPage";
import { useCliente } from "../../context/ClienteContext";

export default function Registrar() {
    const [resultado, setResultado] = useState<Cliente | undefined>(undefined);
    const { user, isAuthenticated, loginWithRedirect } = useAuth0();
    const { handleReloadCliente } = useCliente();

    const urlapi = import.meta.env.VITE_API_URL;
    const clienteService = new ClienteService(urlapi + "/clientes");

    const registerUser = async () => {

        const cliente: Cliente = {
            nombre: user!.given_name ?? '',
            apellido: user!.family_name ?? '',
            email: user!.email,
            fechaNacimiento: new Date(user!.birthdate ?? new Date()),
            imagen: { url: user!.picture },
            rol: "Cliente",
            usuario: { auth0Id: user!.sub, username: user!.name },
            telefono: user!.phone_number ?? '',
            dni: '',
            cuil: ''
        } as Cliente;

        console.log(JSON.stringify(cliente))

        try {
            const resultado = await clienteService.post(cliente);
            localStorage.setItem('usuario', JSON.stringify(resultado));
            handleReloadCliente();
            setResultado(resultado);
        } catch (error) {
            console.error("Error al registrar usuario:", error);
        }
    };

    useEffect(() => {
        if (user && isAuthenticated) {
            registerUser();
        }
    }, [user]);

    useEffect(() => {
        if (resultado) {
            loginWithRedirect({ appState: { returnTo: '/perfil/editar' } });
        }
    }, [resultado]);

    return (
        <>
            {resultado ? <LoaderPage /> : <LoaderPage />}
        </>
    );
}
