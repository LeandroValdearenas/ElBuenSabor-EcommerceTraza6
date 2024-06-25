import HorarioSucursal from "../../entidades/HorarioSucursal";

export const verificarHoraSucursal = (horarios:HorarioSucursal[]) => {
    const fecha = new Date();
    const horariosHoy = horarios.find(horario => 
        horario.diaSemana === ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'][new Date().getDay()]
        )?.horarioDetalles;
    return !horariosHoy?.some(hd => {
        const [horaApertura, minutoApertura, segundoApertura] = hd.horaInicio.toString().split(':').map(Number);
        const [horaCierre, minutoCierre, segundoCierre] = hd.horaFin.toString().split(':').map(Number);
        const apertura = new Date(fecha);
        apertura.setHours(horaApertura, minutoApertura, segundoApertura, 0);
        const cierre = new Date(fecha);
        cierre.setHours(horaCierre, minutoCierre, segundoCierre, 0);
        // Comparar la fecha actual con el horario de apertura y cierre
        return (fecha >= apertura && (fecha <= cierre || hd.horaFin.toString() === '00:00:00'));
    });
}