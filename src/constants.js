/*
 * tipos de acciones
 */

module.exports = {
  NONE: '_NONE_',
  TRACER: '_TRACER_', // save data history 
  STATE: '_STATE_', // Old and new values
  LOGGER: '_LOGGER_',
  AUTO_PARAMS: '_AUTO_PARAMS_' // Detect params function, function(id, name, date) ==> id, name, date
}