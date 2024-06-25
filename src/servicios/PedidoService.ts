import Pedido from "../entidades/Pedido";
import { BackendClient } from "./BackendClient";

export class PedidoService extends BackendClient<Pedido> {
    async encontrarXClienteYSucursal(idCliente:number, idSucursal:number, desde: string, hasta: string): Promise<Pedido[]> {
        const fechaDesdeParam = desde ? `desde=${desde}` : '';
        const fechaHastaParam = hasta ? `hasta=${hasta}` : '';
        const response = await fetch(`${this.baseUrl}/cliente/${idCliente}?idSucursal=${idSucursal}&${fechaDesdeParam}&${fechaHastaParam}`,
            {headers: this.getAuthHeaders()});
        const data = await response.json();
        return data as Pedido[];
    }

    // EXCEL PEDIDOS
    async getExcelPedidos(idCliente:number, idSucursal:number, desde: string, hasta: string) {
        const desdeParam = desde ? `desde=${desde}` : '';
        const hastaParam = hasta ? `hasta=${hasta}` : '';
        const url = `${this.baseUrl}/descargarexcelpedidoscliente/${idCliente}?idSucursal=${idSucursal}&${desdeParam}&${hastaParam}`;

        const response = await fetch(url, {
            headers: this.getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Ocurrió un problema al descargar el archivo, intente más tarde');
        }

        const blob = await response.blob();
        const urlBlob = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = urlBlob;
        a.download = `pedidos_desde_${desde}_hasta_${hasta}.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(urlBlob);
    }
}
