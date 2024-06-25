import Categoria from "../entidades/Categoria";
import { BackendClient } from "./BackendClient";

export class CategoriaService extends BackendClient<Categoria> {
  async buscarXSucursal(id: number): Promise<Categoria[]> {
    const response = await fetch(`${this.baseUrl}/sucursal/${id}`,
      {"headers":this.getAuthHeaders()});
    const data = await response.json();
    return data as Categoria[];
  }
}
