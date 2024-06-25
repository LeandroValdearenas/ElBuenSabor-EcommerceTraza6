import ArticuloManufacturado from "../../entidades/ArticuloManufacturado";
import AddRemove from "../addRemove/AddRemove";
import { Button, Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import Articulo from "../../entidades/Articulo";
import { CCarousel, CCarouselItem } from "@coreui/react";
import "./detalleArticulo.css";
import Promocion from "../../entidades/Promocion";

type DetalleArticuloProps = {
  articulo: Articulo;
  onClose: () => void;
};

const DetalleArticulo = ({ articulo, onClose }: DetalleArticuloProps) => {
  return (
    <Modal isOpen={true} onClose={onClose} size={"4xl"}>
        <ModalContent>
          <ModalHeader>
            <h5 className="modal-title">Detalle de {articulo.denominacion}</h5>
          </ModalHeader>
          <ModalBody>
            <div className="row">
              {articulo.imagenes.length > 0 &&
              <div className="col-md-6 m-auto">
                <div className='p-2'>
                    <CCarousel controls indicators interval={articulo.imagenes.length > 1}>
                    {articulo.imagenes.map(imagen => 
                        <CCarouselItem key={imagen.id} className="rounded p-5 dark">
                            <div className="carousel-md">
                                <img className="rounded h-100 mx-auto" src={imagen.url} alt={imagen.url} />
                            </div>
                        </CCarouselItem>
                    )}
                    </CCarousel>
                </div>
              </div>
              }
              <div className="col">
                <div className="detalle overflow-auto">
                  <p className="card-text mb-0">Categoría: {articulo.categoria?.denominacion}</p>
                  <h5 className="card-title">{articulo.denominacion}</h5>
                  <p className="card-text"><b>${(articulo.precioVenta ?? (articulo as Promocion).precioPromocional).toLocaleString('es-AR')}</b></p>
                  
                  {(articulo as Promocion).promocionDetalles !== undefined 
                  ?
                    <>
                      <h6 className="card-text mb-0">Descripción:</h6>
                      <p className="card-text">{(articulo as Promocion).descripcionDescuento}</p>
                      <h6 className="card-text mb-0">Artículos:</h6>
                      <ul className="card-text">
                      {(articulo as Promocion).promocionDetalles?.map(detalle => 
                        <li key={detalle.id}>{detalle.articulo.denominacion} ({detalle.cantidad} {detalle.articulo.unidadMedida.denominacion})</li>
                      )}
                      </ul>
                    </>
                  : <>
                      <h6 className="card-text mb-0">Resumen:</h6>
                      <p className="card-text">{(articulo as ArticuloManufacturado).resumen ?? `Ahora podés disfrutar de ${articulo.denominacion} en nuestra tienda! Pedilo para acompañar!`}</p>
                    </>
                  }
                  {(articulo as ArticuloManufacturado).descripcion !== undefined 
                  &&
                    <>
                      <h6 className="card-text mb-0">Descripción:</h6>
                      <p className="card-text">{(articulo as ArticuloManufacturado).descripcion}</p>
                    </>
                  }
                  {(articulo as ArticuloManufacturado).articuloManufacturadoDetalles !== undefined &&
                    <>
                      <h6 className="card-text mb-0">Ingredientes:</h6>
                      <ul className="card-text">
                      {(articulo as ArticuloManufacturado).articuloManufacturadoDetalles?.map(detalle => 
                        <li key={detalle.id}>{detalle.articuloInsumo.denominacion} ({detalle.cantidad} {detalle.articuloInsumo.unidadMedida.denominacion})</li>
                      )}
                      </ul>
                    </>
                  }
                </div>
                <div className="mt-4 mb-4 d-flex justify-content-between">
                    {articulo ? <AddRemove articulo={articulo} /> : null}
                    <Button className="mt-auto" onPress={onClose}>Cerrar</Button>
                </div>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
    </Modal>
  );
};

export default DetalleArticulo;
