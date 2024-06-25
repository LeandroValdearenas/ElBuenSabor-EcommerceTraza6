import { useEffect, useState } from "react";
import Domicilio from '../../entidades/Domicilio';
import { LocalidadService } from "../../servicios/LocalidadService";
import { ProvinciaService } from "../../servicios/ProvinciaService";
import { PaisService } from "../../servicios/PaisService";
import { Autocomplete, AutocompleteItem, Input } from "@nextui-org/react";
import Localidad from "../../entidades/Localidad";

type DomiciliosArgs = {
    domicilio: Domicilio,
    errors?: { [key in keyof Domicilio]?: string },
    handleChangeDomicilio: (key: keyof object, value: any) => void
}

function DomicilioForm({ domicilio, handleChangeDomicilio }: DomiciliosArgs) {
    const [localidades, setLocalidades] = useState<Localidad[]>([]);
    const [paisesOpciones, setPaisesOpciones] = useState<{ id: number, label: string }[]>([]);
    const [provinciasOpciones, setProvinciasOpciones] = useState<{ id: number, label: string }[]>([]);
    const [localidadesOpciones, setLocalidadesOpciones] = useState<{ id: number, label: string }[]>([]);
    const [selectedPais, setSelectedPais] = useState<string | number | null | undefined>(null);
    const [selectedProvincia, setSelectedProvincia] = useState<string | number | null | undefined>(null);
    const [selectedLocalidad, setSelectedLocalidad] = useState<string | number | null | undefined>(null);

    const urlapi = import.meta.env.VITE_API_URL;
    const localidadService = new LocalidadService(urlapi + "/localidades");
    const provinciaService = new ProvinciaService(urlapi + "/provincias");
    const paisService = new PaisService(urlapi + "/paises");

    const getLocalidadesRest = async () => {
        const localidades = await localidadService.getAll();
        setLocalidades(localidades);
    }

    const getLocalidadesPorProvinciaRest = (idProvincia?: string) => {
        const localidadesFiltradas = idProvincia ? localidades.filter(l => String(l.provincia.id) === idProvincia) : localidades;
        const localidadesOpciones = [{ id: 0, label: 'Seleccione una localidad' }, ...localidadesFiltradas.map(l => { return { id: l.id, label: l.nombre } })]
        setLocalidadesOpciones(localidadesOpciones);
    }

    const getProvinciasRest = async (idPais?: string) => {
        const provincias = await provinciaService.getAll();
        const provinciasFiltradas = idPais ? provincias.filter(p => String(p.pais.id) === idPais) : provincias;
        const provinciasOpciones = [{ id: 0, label: 'Seleccione una provincia' }, ...provinciasFiltradas.map(p => { return { id: p.id, label: p.nombre } })]
        setProvinciasOpciones(provinciasOpciones);
    }

    const getPaisesRest = async () => {
        const paises = [{ id: 0, label: 'Seleccione un país' }, ...((await paisService.getAll()).map(p => { return { id: p.id, label: p.nombre } }))]
        setPaisesOpciones(paises);
    }

    const handleChangePais = (value: string | number | null) => {
        setSelectedPais(value);
        setSelectedProvincia('0');
        setSelectedLocalidad('0');
    }

    const handleChangeProvincia = (value: string | number | null) => {
        setSelectedProvincia(value);
        setSelectedLocalidad('0');
    }

    const handleChangeLocalidad = (value: string | number | null) => {
        setSelectedLocalidad(value);
    }

    const handleSubmitLocalidad = () => {
        if (!localidades.length || !Number(selectedLocalidad) || !Number(selectedProvincia) || !Number(selectedPais))
            return;
        const newData = { ...domicilio, localidad: localidades.find(l => l.id === Number(selectedLocalidad))};
        handleChangeDomicilio('domicilio' as keyof object, newData);
    }

    const handleChange = (key: string, value: any) => {
        let finalValue: any;
        if (typeof domicilio[key as keyof Domicilio] === 'number') {
            finalValue = Number(value);
        } else {
            finalValue = value;
        }

        const newData = { ...domicilio, [key]: finalValue };

        handleChangeDomicilio('domicilio' as keyof object, newData);
    };

    useEffect(() => {
        getLocalidadesRest();
    }, []);

    useEffect(() => {
        if (localidades.length) {
            getPaisesRest();
            if (domicilio.localidad) {
                setSelectedPais(String(domicilio.localidad.provincia.pais.id));
                setSelectedProvincia(String(domicilio.localidad.provincia.id));
                setSelectedLocalidad(String(domicilio.localidad.id));
            }
        }
    }, [domicilio.id, localidades]);

    useEffect(() => {
        if (selectedPais !== 0)
            getProvinciasRest(String(selectedPais) ?? '0');
    }, [selectedPais]);

    useEffect(() => {
        if (selectedProvincia !== 0)
            getLocalidadesPorProvinciaRest(String(selectedProvincia) ?? '0');
    }, [selectedProvincia]);

    useEffect(() => {
        handleSubmitLocalidad();
    }, [selectedLocalidad]);

    return (
        <div className="d-flex flex-column h-100 mb-3 justify-content-between" >
            <div className="mb-3 row">
                <div className="col-9">
                    <Input
                        type='text'
                        id='calle'
                        label='Calle'
                        isRequired
                        value={domicilio.calle}
                        onChange={(e) => handleChange('calle', e.target.value)}
                        required
                    />
                </div>
                <div className="col-3">
                    <Input
                        type='number'
                        id='numero'
                        inputMode='numeric'
                        label='Número'
                        isRequired
                        min={0}
                        value={String(domicilio.numero)}
                        onChange={(e) => handleChange('numero', e.target.value)}
                        required
                    />
                </div>
            </div>
            <div className="mb-3 row">
                <div className="col">
                    <Autocomplete
                        label="País"
                        isRequired
                        placeholder="Buscar el país"
                        className="max-w-xs"
                        defaultSelectedKey={selectedPais ?? 0}
                        defaultItems={paisesOpciones}
                        selectedKey={selectedPais}
                        allowsCustomValue={true}
                        onSelectionChange={handleChangePais}
                    >
                        {(item) => <AutocompleteItem key={item.id}>{item.label}</AutocompleteItem>}
                    </Autocomplete>
                </div>
                <div className="col">
                    <Autocomplete
                        label="Provincia"
                        isRequired
                        placeholder="Buscar la provincia"
                        className="max-w-xs"
                        defaultSelectedKey={selectedProvincia ?? 0}
                        defaultItems={provinciasOpciones}
                        selectedKey={selectedProvincia}
                        allowsCustomValue={true}
                        onSelectionChange={handleChangeProvincia}
                    >
                        {(item) => <AutocompleteItem key={item.id}>{item.label}</AutocompleteItem>}
                    </Autocomplete>
                </div>
            </div>
            <div className="mb-3 row align-items-end">
                <div className="col">
                    <Autocomplete
                        label="Localidad"
                        isRequired
                        placeholder="Buscar la localidad"
                        className="max-w-xs"
                        defaultSelectedKey={selectedLocalidad ?? 0}
                        defaultItems={localidadesOpciones}
                        selectedKey={selectedLocalidad}
                        allowsCustomValue={true}
                        onSelectionChange={handleChangeLocalidad}
                    >
                        {(item) => <AutocompleteItem key={item.id}>{item.label}</AutocompleteItem>}
                    </Autocomplete>
                </div>
                <div className="col-5">
                    <Input
                        type='number'
                        id='cp'
                        label='Código postal'
                        inputMode='numeric'
                        min={0}
                        value={String(domicilio.cp)}
                        onChange={(e) => handleChange('cp', e.target.value)}
                        required
                    />
                </div>
            </div>
        </div>
    );
}

export default DomicilioForm;
