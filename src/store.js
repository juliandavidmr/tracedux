var redux = require('redux')
var reducers = require('./reducers')
var constants = require('./constants')
var actions = require('./actions')
var utils = require('./_utlis')
var log = console.log;

var store = redux.createStore(reducers, constants.LOGGER)

/*
let unsubscribe = store.subscribe(() =>
  console.log("Actual state:", store.getState())
)
*/

var options_data;
var tracers = {}

function defineTracers(params) {
  for (var key in constants) {
    if (constants.hasOwnProperty(key)) {
      tracers[constants[key]] = []
    }
  }
}

/**
 * @param {function} req
 * @param {function} res
 * @param {function} next
 */
function app(req, res, next) {
  for (var key in constants) {
    tracers[constants[key]].map(check => {
      if (check.type === constants.AUTO_PARAMS) {
        var data = Object.assign({}, req.body, req.params, req.query);
        store.dispatch(
          actions.boundAutoparams(data, check.exec, check.args, req, res, next)
        )
        // log(check)
      }
    })
  }
}

/**
 * @param {Array<any>} options
 */
function conf(options) {
  if (!options) {
    console.warn('No configuration data defined. Check the "conf" method');
  } else if (typeof options === 'object') {
    options_data = options;
  } else {
    console.warn('Param invalid.')
  }

  if (!!options_data) {
    defineTracers(options_data);
    options_data.map(it => {
      if (it.type === constants.AUTO_PARAMS) {
        var args = utils.gpn(it.exec);
        it.args = args;
      }
      tracers[it.type].push(it);
    })
    // console.log("TracerS:", JSON.stringify(tracers, null, 3))
  }

  return app
}


module.exports.constants = constants;
module.exports.app = app;
module.exports.conf = conf;
module.exports.store = store;