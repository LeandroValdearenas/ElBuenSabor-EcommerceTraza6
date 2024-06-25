import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "@nextui-org/react";

const LoginButton = () => {
    const { loginWithRedirect } = useAuth0();

    return (
        <Link href="#" onClick={() => 
            loginWithRedirect({
                appState: {
                    returnTo: window.location.pathname,
                },
            })
        }>
            Iniciar sesión
        </Link>
    );
}

export default LoginButton;