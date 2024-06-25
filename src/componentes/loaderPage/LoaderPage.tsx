import { CircularProgress } from "@nextui-org/react"
import './loader-page.css';

function LoaderPage() {
    return (
        <div className='loader-page'>
            <CircularProgress label="Cargando..." />
        </div>
    )
}

export default LoaderPage