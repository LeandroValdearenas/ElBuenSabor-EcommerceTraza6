import { useEffect } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import "./mp.css";

function MpCheckout({ idPreference }: { idPreference: string }) {
    const publicKey = import.meta.env.VITE_MP_PUBLICKEY;

    useEffect(() => {
        if (publicKey)
            initMercadoPago(publicKey, { locale: 'es-AR' });
    }, [publicKey]);

    return (
        <div hidden={idPreference === ''}>
            {publicKey && idPreference && <Wallet initialization={{ preferenceId: idPreference, redirectMode: "blank" }} customization={{ texts: { valueProp: 'smart_option' } }} />}
        </div>
    );
}

export default MpCheckout;
