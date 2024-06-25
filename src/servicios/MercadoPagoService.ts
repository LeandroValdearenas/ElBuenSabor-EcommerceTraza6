import Pedido from "../entidades/Pedido";
import PreferenceMP from "../entidades/mp/PreferenceMP";
import { BackendClient } from "./BackendClient";

export class MercadoPagoService extends BackendClient<Pedido> {
    async createPreferenceMP(pedido?:Pedido){
        const urlServer = `${this.baseUrl}/create_preference_mp`;
        const method:string = "POST";
        const response = await fetch(urlServer, {
          "method": method,
          "body": JSON.stringify(pedido),
          "headers":this.getAuthHeaders()
        });
        return await response.json() as PreferenceMP;   
    }
}
