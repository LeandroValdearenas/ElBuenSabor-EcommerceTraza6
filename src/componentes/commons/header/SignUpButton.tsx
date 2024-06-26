import { useAuth0 } from "@auth0/auth0-react";
import { Button, Link } from "@nextui-org/react";

const SignUpButton = () => {
    const { loginWithRedirect } = useAuth0();

    return (
        <Button as={Link} color="primary" variant="flat" onClick={() => 
            loginWithRedirect({
                appState: {
                    returnTo: '/registrar',
                },
                authorizationParams: {
                    initialScreen: "signUp"
                },
            })
        }>
            Registrarse
        </Button>
    );
}

export default SignUpButton;