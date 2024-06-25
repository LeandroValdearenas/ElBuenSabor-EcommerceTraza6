import Domicilio from '../../entidades/Domicilio';
import MostrarDomicilio from "./MostrarDomicilio";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import Domicilios from "./Domicilios";

type DomiciliosArgs = {
    domicilios: Domicilio[],
    domicilio: Domicilio | undefined,
    editar?: boolean,
    handleChangeDomicilios: (value: Domicilio[]) => void,
    handleSeleccionarDomicilio: (value: Domicilio) => void
}

function DomicilioSeleccionado({ domicilios, domicilio, handleChangeDomicilios, handleSeleccionarDomicilio }: DomiciliosArgs) {
    const {isOpen, onOpen, onClose, onOpenChange} = useDisclosure();

    const handleShow = (datos?: Domicilio) => {
        const seleccionado = {id:0, calle:'', numero:0, cp:0, localidad: {id:0, nombre:'', provincia:{id:0, nombre:'', pais: {id: 0, nombre: ''}}}};
        if (datos) {
            Object.assign(seleccionado, datos);
        }
        onOpen();
    }

    const handleCambiarDomicilio = (value:Domicilio) => {
        onClose();
        handleSeleccionarDomicilio(value);
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
                        <Domicilios domicilios={domicilios} handleChangeDomicilios={handleChangeDomicilios} handleSeleccionarDomicilio={handleCambiarDomicilio} crear seleccionar />
                    </ModalBody>

                    <ModalFooter>
                        <Button color="danger" variant="light" onClick={onClose}>
                            Cerrar
                        </Button>
                    </ModalFooter>
                </>
                )}
                </ModalContent>
            </Modal>
            
            { domicilio &&
            <div className='row mx-0 justify-content-center'>
                <MostrarDomicilio key={domicilio.id} handleOpenModal={handleShow} domicilioPrevio={domicilio} handleDelete={() => {}} />
            </div> }

            <hr className='my-2' />
            <div className="row mx-0">
                <button type='button' className="btn btn-secondary" onClick={() => handleShow(domicilio)}>Modificar dirección</button>
            </div>
        </>
    );
}

export default DomicilioSeleccionado;