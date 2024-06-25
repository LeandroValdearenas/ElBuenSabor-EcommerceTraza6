import Profile from "./Profile";
import Header from "../commons/header/Header";

function Perfil ({editar=false}) {
    return <>
        <Header />
        <Profile editar={editar} />
        </>
}

export default Perfil;