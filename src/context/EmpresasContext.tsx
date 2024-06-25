import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { EmpresaService } from "../servicios/EmpresaService";
import Empresa from "../entidades/Empresa";

interface EmpresasContextType {
    empresas: Empresa[],
    empresaSeleccionada: Empresa | undefined,
    handleReloadEmpresa: () => void,
    handleChangeEmpresa: (value:number) => void
}

export const EmpresasContext = createContext<EmpresasContextType>({
    empresas: [],
    empresaSeleccionada: undefined,
    handleReloadEmpresa: () => {},
    handleChangeEmpresa: () => {}
});

export function EmpresasContextProvider({ children }: { children: ReactNode }) {
    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [empresaSeleccionada, setEmpresaSeleccionada] = useState<Empresa | undefined>(undefined);

    const urlapi = import.meta.env.VITE_API_URL;
    const empresasService = new EmpresaService(urlapi + "/empresas");

    const handleChangeEmpresa = (empresaId:number) => {
        setEmpresaSeleccionada(empresas.find(e => e.id === empresaId) ?? undefined);
    }
    const getEmpresaRest = async () => {
        const empresas: Empresa[] = await empresasService.getAll();
        setEmpresas(empresas);
        empresas.forEach(e => e.sucursales.sort((a,b) => a.id - b.id));
        if (!empresaSeleccionada)
            setEmpresaSeleccionada(empresas[0]);
    }

    const handleReloadEmpresa = () => {
        getEmpresaRest();
    }

    useEffect(() => {
        handleReloadEmpresa();
    }, [])

return (
    <EmpresasContext.Provider value={{
        empresas,
        empresaSeleccionada,
        handleReloadEmpresa,
        handleChangeEmpresa
    }}>
        {children}
    </EmpresasContext.Provider>
);
}

export const useEmpresas = () => {
    const context = useContext(EmpresasContext);

    if (context === undefined) {
        throw new Error("useEmpresas debe ser usado dentre del ámbito de un EmpresasContextProvider");
    }

    return context;
}