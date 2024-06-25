import Base from "./Base";

interface UsuarioCliente extends Base {
    auth0Id:string,
    username:string
}

export default UsuarioCliente;