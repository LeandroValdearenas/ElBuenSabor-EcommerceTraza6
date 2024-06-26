import { Card, CardBody, Spinner } from '@nextui-org/react';
import Articulo from '../../entidades/Articulo';
import AddRemove from '../addRemove/AddRemove';
import { useState } from 'react';
import Promocion from '../../entidades/Promocion';

type ArticuloProps = {
  articulo: Articulo;
  onClick: () => void;
};

const ItemArticulo = ({ articulo, onClick }: ArticuloProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Card className='h-100'>
      <CardBody>
        <button onClick={onClick} style={{ position: 'relative', display: 'block', height: '200px' }}>
          {!imageLoaded && (
            <div className='loading-container' style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
              <Spinner />
            </div>
          )}
          <img 
            src={articulo.imagenes[0] ? articulo.imagenes[0].url : 'https://static.vecteezy.com/system/resources/previews/005/007/528/non_2x/restaurant-food-kitchen-line-icon-illustration-logo-template-suitable-for-many-purposes-free-vector.jpg'} 
            className={`mb-2 rounded ${!imageLoaded ? 'd-none' : ''}`} 
            alt={articulo.denominacion} 
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(true)} // Manejar errores de carga
            style={{ display: imageLoaded ? 'block' : 'none', width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </button>
        
        <h6 className='my-0 me-1'>{articulo.denominacion}</h6>
        <div className='d-flex flex-wrap justify-content-between'>
          <div className='align-items-center d-flex justify-content-center' style={{maxWidth:'80%'
          }}>
            
            <h6 className='fw-bold my-0'>${(articulo.precioVenta ?? (articulo as Promocion).precioPromocional).toLocaleString('es-AR')}</h6>
            {/* <div className='d-flex mt-0'>
            <p className='fw-light'><s>${articulo.precioVenta.toLocaleString('es-AR')}</s></p>
            <p className='ms-2 px-1 bg-descuento'>15%</p>
            </div> */}
          </div>
          <div className='ms-auto py-2'>
            <AddRemove articulo={articulo} small/>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default ItemArticulo;
