import ArticuloManufacturado from "../entidades/ArticuloManufacturado";
import { BackendClient } from "./BackendClient";

export class ArticuloManufacturadoService extends BackendClient<ArticuloManufacturado> {
    async buscarXSucursal(sucursalId?: number, busqueda?:string): Promise<ArticuloManufacturado[]> {
        const sucursalUrl = sucursalId ? `sucursalId=${sucursalId}` : '';
        const busquedaUrl = busqueda ? `busqueda=${busqueda}` : '';
        const response = await fetch(`${this.baseUrl}/buscar?${sucursalUrl}&${busquedaUrl}`, {
            headers: this.getAuthHeaders()
          });
        const data = await response.json();
        return data as ArticuloManufacturado[];
    }
    
    async getArticuloManufacturadosByCategoria(id: number): Promise<ArticuloManufacturado[]> {
        const response = await fetch(`${this.baseUrl}/categoria/${id}`,
            {"headers":this.getAuthHeaders()});
        const data = await response.json();
        return data as ArticuloManufacturado[];
    }
}
