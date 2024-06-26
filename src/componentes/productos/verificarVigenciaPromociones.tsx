import Promocion from "../../entidades/Promocion";

export const verificarVigenciaPromociones = (promocion: Promocion) => {
    const fecha = new Date();
    const [horaApertura, minutoApertura, segundoApertura] = promocion.horaDesde.toString().split(':').map(Number);
    const [horaCierre, minutoCierre, segundoCierre] = promocion.horaHasta.toString().split(':').map(Number);
    
    if (promocion.tipoPromocion === 'Promocion') {

        const comienzoPromocion = new Date(promocion.fechaDesde);
        comienzoPromocion.setHours(horaApertura, minutoApertura, segundoApertura, 0);
        const finPromocion = new Date(promocion.fechaHasta);
        finPromocion.setHours(horaCierre, minutoCierre, segundoCierre, 0);

        // Comparar la fecha actual con el horario de apertura y cierre
        return (fecha >= comienzoPromocion && (fecha <= finPromocion || promocion.horaHasta.toString() === '00:00:00'));

    } else {

        const inicioHappyHour = new Date(fecha);
        inicioHappyHour.setHours(horaApertura, minutoApertura, segundoApertura, 0);
        const cierreHappyHour = new Date(fecha);
        cierreHappyHour.setHours(horaCierre, minutoCierre, segundoCierre, 0);

        // Comparar la fecha actual con el horario de apertura y cierre
        return (
            (fecha >= promocion.fechaDesde && fecha <= promocion.fechaHasta) 
            && (fecha >= inicioHappyHour && (fecha <= cierreHappyHour || promocion.horaDesde.toString() === '00:00:00'))
        );
    }
}