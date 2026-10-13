// MODIFICAR: src/presentacion/citasRoutes.js
const express = require('express');
const { ErrorDeNegocio } = require('../dominio/reglasDeAgenda');

function crearCitasRoutes({ citaService }) {
  const router = express.Router();
  const CODIGO_HTTP = {
    DATOS_FALTANTES: 400, FECHA_INVALIDA: 400,
    FECHA_PASADA: 400, AGENDA_OCUPADA: 409
  };
  router.get('/salud', (req, res) =>
    res.json({ estado: 'ok', servidor: 'activo',
               hora: new Date().toISOString() }));
  router.get('/citas', async (req, res) => {
    try { res.json(await citaService.consultarCitas()); }
    catch (e) { console.error(e); res.status(500).json({
      error: 'No se pudo consultar la base de datos' }); }
  });
  router.get('/profesionales', async (req, res) => {
    try { res.json(await citaService.consultarProfesionales()); }
    catch (e) { console.error(e); res.status(500).json({
      error: 'No se pudo consultar la base de datos' }); }
  });
  router.post('/citas', async (req, res) => {
    try {
      const resultado = await citaService.reservarCita(req.body);
      res.status(201).json(resultado);
    } catch (e) {
      if (e instanceof ErrorDeNegocio) {
        res.status(CODIGO_HTTP[e.codigo] || 400).json({ error: e.message });
      } else {
        console.error(e);
        res.status(500).json({ error: 'No se pudo guardar en la base de datos' });
      }
    }
  });
  return router;
}
module.exports = { crearCitasRoutes };
