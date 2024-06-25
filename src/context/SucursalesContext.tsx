import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import Sucursal from "../entidades/Sucursal";
import { useEmpresas } from "./EmpresasContext";
import { useLocation } from "react-router-dom";

interface SucursalesContextType {
    sucursales: Sucursal[],
    sucursalSeleccionada: Sucursal | undefined,
    handleReloadSucursales: () => void,
    handleChangeSucursal: (value:number) => void
}

export const SucursalesContext = createContext<SucursalesContextType>({
    sucursales: [],
    sucursalSeleccionada: undefined,
    handleReloadSucursales: () => {},
    handleChangeSucursal: () => {}
});

export function SucursalesContextProvider({ children }: { children: ReactNode }) {
    const location = useLocation();
    const [sucursales, setSucursales] = useState<Sucursal[]>([]);
    const [sucursalSeleccionada, setSucursalSeleccionada] = useState<Sucursal | undefined>(location.state?.sucursalSeleccionada || undefined);
    const {empresaSeleccionada} = useEmpresas();

    const handleChangeSucursal = (sucursalId:number) => {
        setSucursalSeleccionada(sucursales.find(e => e.id === sucursalId) ?? undefined);
    }

    const handleReloadSucursales = () => {
        if (empresaSeleccionada) {
            const sucursales = empresaSeleccionada.sucursales.sort((a,b) => a.id - b.id);
            setSucursales(sucursales);
            if (!sucursalSeleccionada)
                setSucursalSeleccionada(sucursales[0] ?? undefined);
        }
    }

    useEffect(() => {
        handleReloadSucursales();
    }, [empresaSeleccionada])

    useEffect(() => {
        if (location.state?.sucursalSeleccionada && sucursalSeleccionada !== location.state?.sucursalSeleccionada)
            setSucursalSeleccionada(location.state?.sucursalSeleccionada);
    }, [location.state?.sucursalSeleccionada])

return (
    <SucursalesContext.Provider value={{
        sucursales,
        sucursalSeleccionada,
        handleChangeSucursal,
        handleReloadSucursales
    }}>
        {children}
    </SucursalesContext.Provider>
);
}

export const useSucursales = () => {
    const context = useContext(SucursalesContext);

    if (context === undefined) {
        throw new Error("useSucursales debe ser usado dentre del ámbito de un SucursalesContextProvider");
    }

    return context;
}