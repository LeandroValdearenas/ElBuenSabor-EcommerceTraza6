import { useState } from "react";
import Domicilio from '../../entidades/Domicilio';
import MostrarDomicilio from "./MostrarDomicilio";
import DomicilioForm from "./DomicilioForm";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";

type DomiciliosArgs = {
    domicilios: Domicilio[],
    crear?:boolean,
    editar?: boolean,
    seleccionar?: boolean,
    handleChangeDomicilios: (value: Domicilio[]) => void,
    handleSeleccionarDomicilio?: (value: Domicilio) => void
}

function Domicilios({ domicilios, editar = false, crear = editar, seleccionar = false, handleChangeDomicilios, handleSeleccionarDomicilio = () => {} }: DomiciliosArgs) {
    const [domicilioSeleccionado, setDomicilioSeleccionado] = useState<Domicilio>({} as Domicilio);
    const {isOpen, onOpen, onClose, onOpenChange} = useDisclosure();

    const handleDomicilioChange = (_key: keyof Domicilio, value: Domicilio) => {
        const domicilioNuevo = value;
        domicilioNuevo.id = domicilioSeleccionado.id;
        setDomicilioSeleccionado(domicilioNuevo);
    }

    const handleShow = (datos?: Domicilio) => {
        const seleccionado = {id:0, calle:'', numero:0, cp:0, localidad: {id:0, nombre:'', provincia:{id:0, nombre:'', pais: {id: 0, nombre: ''}}}};
        if (datos) {
            Object.assign(seleccionado, datos);
        }
        setDomicilioSeleccionado(seleccionado);
        onOpen();
    }

    const handleDomicilioUpdate = () => {
        onClose();
        handleChangeDomicilios([...domicilios.filter(domicilio => domicilio.id !== domicilioSeleccionado.id), domicilioSeleccionado].sort((a, b) => a.id - b.id));
    }

    const handleDomicilioDelete = (id: number) => {
        handleChangeDomicilios([...domicilios.filter(domicilio => domicilio.id !== id)].sort((a, b) => a.id - b.id));
    }

    return (
        <>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                {(onClose) => (
                <>
                    <ModalHeader className="flex flex-col gap-1">
                        Domicilio
                    </ModalHeader>
                    
                    <ModalBody>
                        <DomicilioForm domicilio={domicilioSeleccionado} handleChangeDomicilio={handleDomicilioChange} />
                    </ModalBody>

                    <ModalFooter>
                        <Button color="danger" onClick={onClose}>
                            Cerrar
                        </Button>
                        <Button color="primary" onClick={handleDomicilioUpdate}>
                            Enviar
                        </Button>
                    </ModalFooter>
                </>
                )}
                </ModalContent>
            </Modal>

            <div style={{ overflowY: "scroll", height: "298px" }}>
                <div className="mx-3" >
                    {domicilios.map((domicilio) =>
                        seleccionar 
                        ?
                            <button className="w-100 my-1" key={domicilio.id} onClick={() => handleSeleccionarDomicilio(domicilio)}>
                                <MostrarDomicilio handleOpenModal={handleShow} domicilioPrevio={domicilio} editar={editar} handleDelete={handleDomicilioDelete} />
                            </button>
                        :   <div key={domicilio.id} className="my-1">
                                <MostrarDomicilio handleOpenModal={handleShow} domicilioPrevio={domicilio} editar={editar} handleDelete={handleDomicilioDelete} />
                            </div>
                    )}
                </div>
            </div>

            {crear &&
                <div className="row mx-1 mt-3">
                    <Button size="sm" color="secondary" onClick={() => handleShow({id:0, calle:'', numero:0, cp:0, localidad: {id:0, nombre:'', provincia:{id:0, nombre:'', pais: {id: 0, nombre: ''}}}})}>
                        Nuevo
                    </Button>
                </div>
            }

        </>
    );
}

export default Domicilios;