import Header from '../componentes/commons/header/Header';
import Productos from '../componentes/productos/Productos';
import { CCarousel, CCarouselItem } from '@coreui/react';
import '@coreui/coreui/dist/css/coreui.min.css'
import { useEffect, useState } from 'react';
import Promocion from '../entidades/Promocion';
import { useSucursales } from '../context/SucursalesContext';
import { PromocionService } from '../servicios/PromocionService';
import LoaderPage from '../componentes/loaderPage/LoaderPage';
import { verificarVigenciaPromociones } from '../componentes/productos/verificarVigenciaPromociones';

const Home = () => {
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const {sucursalSeleccionada} = useSucursales();

  const urlapi = import.meta.env.VITE_API_URL;
  const promocionService = new PromocionService(`${urlapi}/promociones`);
  
  const getPromocionesRest = async () => {
    const promociones = await promocionService.getAll();
    const promocionesFiltradas = promociones.filter(p => p.sucursales.map(s => s.id).includes(sucursalSeleccionada!.id) && verificarVigenciaPromociones(p));
    setPromociones(promocionesFiltradas);
  }

  useEffect(() => {
    if (sucursalSeleccionada)
      getPromocionesRest();
  }, [sucursalSeleccionada]);

  return (
    <div className='bg-gris'>
      <Header />
      {sucursalSeleccionada 
        ? <div className='container'>
            {(promociones.length > 0) 
            && <CCarousel controls indicators>
                {promociones.map((promocion, index) => (
                  <CCarouselItem key={index} className='dark'>
                    <div className='d-flex justify-content-center carousel-lg'>
                    <img src={promocion.imagenes[0].url} alt={promocion.denominacion} />
                    </div>
                  </CCarouselItem>
                ))}
              </CCarousel>
            }
            <Productos />
          </div>
        : <LoaderPage />
      }
    </div>
  );
};

export default Home;