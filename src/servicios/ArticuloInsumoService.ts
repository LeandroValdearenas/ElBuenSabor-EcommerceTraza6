import ArticuloInsumo from "../entidades/ArticuloInsumo";
import { BackendClient } from "./BackendClient";

export class ArticuloInsumoService extends BackendClient<ArticuloInsumo> {
    async getArticuloInsumosByCategoria(id: number): Promise<ArticuloInsumo[]> {
        const response = await fetch(`${this.baseUrl}/categoria/${id}`,
            {"headers":this.getAuthHeaders()});
        const data = await response.json();
        return data as ArticuloInsumo[];
    }
}
