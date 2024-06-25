import Base from "./Base";

interface Categoria extends Base {
    denominacion:string,
    subCategorias:Categoria[]
}

export default Categoria;