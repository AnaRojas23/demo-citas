// MODIFICAR: src/aplicacion/citaService.js
const reglas = require('../dominio/reglasDeAgenda');
const { verificarRepositorios } = require('./contratos/repositorios');

function crearCitaService({ citaRepository, profesionalRepository,
                            reloj = () => new Date() }) {
  verificarRepositorios({ citaRepository, profesionalRepository });
  return {
    consultarCitas: () => citaRepository.listarTodas(),
    consultarProfesionales: () => profesionalRepository.listarTodos(),
    reservarCita: async (datos) => {
      reglas.validarDatosCompletos(datos);
      reglas.validarFechaFutura(datos.fecha_hora, reloj());
      const ocupado = await citaRepository.existeEnHorario(
        datos.profesional_id, datos.fecha_hora
      );
      reglas.validarAgendaLibre(ocupado);
      const id = await citaRepository.guardar(datos);
      return { mensaje: 'Cita creada', id };
    }
  };
}

module.exports = { crearCitaService };
