import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import Cliente from "../entidades/Cliente";

interface ClienteContextType {
    cliente: Cliente | undefined,
    handleReloadCliente: () => void
}

export const ClienteContext = createContext<ClienteContextType>({
    cliente: undefined,
    handleReloadCliente: () => {}
});

export function ClienteContextProvider({ children }: { children: ReactNode }) {
    const [cliente, setCliente] = useState<Cliente | undefined>(localStorage.getItem("usuario") ? JSON.parse(localStorage.getItem("usuario")!) : undefined);

    const handleReloadCliente = async () => {
        const usuario = localStorage.getItem("usuario");
        const cliente:Cliente = usuario ? JSON.parse(usuario) : undefined;
        if (cliente)
            setCliente(cliente);
    }

    useEffect(() => {
        handleReloadCliente();
    }, [])

return (
    <ClienteContext.Provider value={{
        cliente,
        handleReloadCliente
    }}>
        {children}
    </ClienteContext.Provider>
);
}

export const useCliente = () => {
    const context = useContext(ClienteContext);

    if (context === undefined) {
        throw new Error("useSucursales debe ser usado dentre del ámbito de un SucursalesContextProvider");
    }

    return context;
}