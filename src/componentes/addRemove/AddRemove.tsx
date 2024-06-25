import { useCart } from "../../context/CartContext";
import Articulo from "../../entidades/Articulo";
import { DeleteIcon } from "../icons";
import './addRemove.css';

type AddRemoveProps = {
    articulo: Articulo,
    small?: boolean
}

function AddRemove(args: AddRemoveProps) {
    const { cart, addCart, removeItemCart } = useCart();

    const existeArticuloEnCarrito = (product:(Articulo)) => {
        return cart.some(item => item.articulo.id === product.id)
    }

    const cantidadArticuloEnCarrito = (product:(Articulo)) => {
        return cart.find(item => item.articulo.id === product.id)?.cantidad || 0;
    }

    return (
        <> {
        (args.articulo && args.articulo.stockActual > 0) 
            ?
            (existeArticuloEnCarrito(args.articulo) 
                ? 
                <div className="btn-add-container">
                    <a className="btn btn-add btn-add-small btn-danger d-flex text-light justify-content-center" onClick={() => removeItemCart(args.articulo)}>
                    {(cantidadArticuloEnCarrito(args.articulo) > 1) ? "-" : <DeleteIcon size={20} color="#ffffff" />}
                    </a>

                    <div className="add-counter my-auto d-flex justify-content-center">
                    <p className="mx-2 fw-bold my-auto">
                    {cantidadArticuloEnCarrito(args.articulo)}
                    </p>
                    </div>

                    <a className={"btn btn-add btn-add-small text-light btn-success " + ((args.articulo.stockActual <= cantidadArticuloEnCarrito(args.articulo)) ? 'disabled' : '')} onClick={() => addCart(args.articulo)}>
                    +
                    </a>
                </div>
                : (
                args.small
                    ?   <div className="row me-1 text-white bg-success rounded btn-add-single">
                        <a className="btn btn-add btn-add-big btn-success" onClick={() => addCart(args.articulo)}>
                        +
                        </a>
                        </div>

                    :   <div className="row d-inline-flex text-white bg-success rounded">
                        <a className="btn btn-add btn-add-big btn-success" onClick={() => addCart(args.articulo)}>
                        Agregar al carrito
                        </a>
                        </div>
                )
            )
            :
            <div className="row mx-auto text-white sin-stock">
                <a className="btn btn-secondary disabled">
                Sin stock
                </a>
            </div>
        } </>
    )
}

export default AddRemove;