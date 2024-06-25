import Cliente from "../entidades/Cliente";
import { BackendClient } from "./BackendClient";

export class ClienteService extends BackendClient<Cliente> {
  async buscarXUsuarioAuth0(idAuth0?:string): Promise<Cliente> {
    const response = await fetch(`${this.baseUrl}/auth0id/${idAuth0}`, {
        headers: this.getAuthHeaders()
      });
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data as Cliente;
  }
}
