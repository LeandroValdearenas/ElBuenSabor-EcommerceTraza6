import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useCliente } from '../../context/ClienteContext';

export const RutaPrivada = ({ children }: { children: ReactNode }) => {
    const { cliente } = useCliente();
    
	return cliente ? children : <Navigate to='../home'/>;
};