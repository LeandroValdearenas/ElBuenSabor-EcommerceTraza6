import { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody } from '@nextui-org/react';
import Categoria from '../../entidades/Categoria';
import { ArticuloManufacturadoService } from '../../servicios/ArticuloManufacturadoService';
import { ArticuloInsumoService } from '../../servicios/ArticuloInsumoService';
import { CategoriaService } from '../../servicios/CategoriaService';
import ItemArticulo from './ItemArticulo';
import Carrito from '../carrito/Carrito';
import DetalleArticulo from './DetalleArticulo';
import { AnimatePresence, motion } from 'framer-motion';
import "./productos.css";
import { useSucursales } from '../../context/SucursalesContext';
import Promocion from '../../entidades/Promocion';
import { PromocionService } from '../../servicios/PromocionService';
import Articulo from '../../entidades/Articulo';
import ArticuloManufacturado from '../../entidades/ArticuloManufacturado';
import { verificarVigenciaPromociones } from './verificarVigenciaPromociones';

const Productos = () => {
  const { sucursalSeleccionada } = useSucursales();
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [selectedDetalle, setSelectedDetalle] = useState<Articulo | undefined>(undefined);

  const urlapi = import.meta.env.VITE_API_URL;
  const articuloManufacturadoService = new ArticuloManufacturadoService(`${urlapi}/manufacturados`);
  const articuloInsumoService = new ArticuloInsumoService(`${urlapi}/insumos`);
  const categoriaService = new CategoriaService(`${urlapi}/categorias`);
  const promocionService = new PromocionService(`${urlapi}/promociones`);

  const fetchArticulos = async () => {
    const manufacturados = await articuloManufacturadoService.buscarXSucursal(sucursalSeleccionada?.id);
    const insumos = (await articuloInsumoService.getAll()).filter(articulo => !articulo.esParaElaborar);
    insumos.forEach(insumo => insumo.stockActual = insumo.stocksInsumo!.find(s => s.sucursal.id === sucursalSeleccionada!.id)?.stockActual ?? 0);
    setArticulos([...manufacturados, ...insumos]);
  };

  const getPromocionesRest = async () => {
    const promociones = promocionService.getAll();
    const promocionesFiltradas = (await promociones).filter(p => p.sucursales.map(s => s.id).includes(sucursalSeleccionada!.id) && verificarVigenciaPromociones(p));
    promocionesFiltradas.forEach(promocion => 
      promocion.promocionDetalles.forEach(detalle => 
        detalle.articulo = {...articulos.find(a => 
          a.id === detalle.articulo.id )!, 
          type:(detalle.articulo as ArticuloManufacturado).articuloManufacturadoDetalles === undefined 
            ? 'insumo' 
            : 'manufacturado'
          }));
    promocionesFiltradas.forEach(promocion => promocion.stockActual = promocion.promocionDetalles.map(detalle => detalle.articulo.stockActual / detalle.cantidad).sort((a,b) => a - b)[0]);
    setPromociones(promocionesFiltradas);
  };

  const fetchCategorias = async () => {
    const categorias = await categoriaService.buscarXSucursal(sucursalSeleccionada!.id);
    setCategorias(categorias.filter(categoria => articulos.map(articulo => articulo.categoria.id).includes(categoria.id)));
  };

  useEffect(() => {
    if (sucursalSeleccionada) {
      fetchArticulos();
    }
  }, [sucursalSeleccionada]);

  useEffect(() => {
    if (sucursalSeleccionada && articulos.length) {
      fetchCategorias();
      getPromocionesRest();
    }
  }, [sucursalSeleccionada, articulos]);

  return (
    <>
    <div className='row justify-content-between'>
      {categorias.map(categoria => (
          <div key={categoria.id} className='col'>
            <a href={"#categoria-" + categoria.id} className='text-decoration-none w-100'>
              <Card className={`w-100 mt-2`}>
                <CardHeader className={`justify-content-center`}>
                  <h4 className="text-nowrap text-center">{categoria.denominacion}</h4>
                </CardHeader>
              </Card>
            </a>
          </div>
        ))}
        {(promociones.length > 0) && <div className='col'>
          <a href={"#categoria-promociones"} className='text-decoration-none w-100'>
            <Card className='w-100 mt-2'>
              <CardHeader className='justify-content-center'>
                <h4 className={'text-nowrap text-center'}>Promociones</h4>
              </CardHeader>
            </Card>
          </a>
        </div>}
      </div>
      <div className=''>
      {categorias.map(categoria => (
        <Card id={"categoria-" + categoria.id} className={`d-flex categoria-card selected m-0  mt-2`} key={categoria.id} >
          <CardHeader>
            <h4>{categoria.denominacion}</h4>
          </CardHeader>
          <CardBody className='d-flex flex-row flex-wrap justify-content-start' >
            <AnimatePresence>
              {articulos.filter(a => a.categoria.id === categoria.id).map((articulo, index) => (
                <motion.div
                  key={articulo.id}
                  initial={{ opacity: 0, y: -20 * (index + 1) }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 + (index) * 0.025 }}
                  className='col-12 col-sm-12 col-md-5 col-lg-3 col-xl-2 m-md-4 m-lg-3 m-xl-3'
                >
                  <ItemArticulo key={articulo.id} articulo={articulo} onClick={() => setSelectedDetalle(articulo)} />
                </motion.div>
              ))}
            </AnimatePresence>
          </CardBody>
        </Card>
      ))}
      {(promociones.length > 0) && 
        <Card id={"categoria-promociones"} className={`d-flex categoria-card selected m-0  mt-2`} >
          <CardHeader>
            <h4>Promociones</h4>
          </CardHeader>
          <CardBody className='d-flex flex-row flex-wrap justify-content-start'>
            <AnimatePresence>
              {promociones.map((promocion, index) => (
                <motion.div
                  key={promocion.id}
                  initial={{ opacity: 0, y: -20 * (index + 1) }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 + (index) * 0.025 }}
                  className='col-12 col-sm-12 col-md-5 col-lg-3 col-xl-2 m-md-4 m-lg-3 m-xl-3'
                >
                  <ItemArticulo key={promocion.id} articulo={promocion} onClick={() => setSelectedDetalle(promocion)} />
                </motion.div>
              ))}
            </AnimatePresence>
          </CardBody>
        </Card>
      }
      <Carrito />
      {selectedDetalle && <DetalleArticulo articulo={selectedDetalle} onClose={() => setSelectedDetalle(undefined)} />}
    </div>
    </>
  );
};

export default Productos;