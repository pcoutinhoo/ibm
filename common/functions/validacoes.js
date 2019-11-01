
// eslint-disable-next-line strict
const reserva = require('../models/reserva');

module.exports = {
  validaTipo: _validaTipo,
};

    function _validaTipo(ctx) {
        if (ctx.instance.tipo == 'SAIBRO' || ctx.instance.tipo == 'HARD') {
          return true;
        }
      return false;
    }