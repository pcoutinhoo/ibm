'use strict';
const validacoes = require('../functions/validacoes');

module.exports = function(Reserva) {
  Reserva.disableRemoteMethodByName('patchOrCreate');
  Reserva.disableRemoteMethodByName('findById');
  Reserva.disableRemoteMethodByName('upsertWithWhere');
  Reserva.disableRemoteMethodByName('count');
  Reserva.disableRemoteMethodByName('findOne');
  Reserva.disableRemoteMethodByName('findById');
  Reserva.disableRemoteMethodByName('createChangeStream');
  Reserva.disableRemoteMethodByName('exists');

  Reserva.observe('before save', function(ctx, next) {
    console.log('brefore save', ctx);
    if (!ctx.instance) {
      next();
      return;
    }

    if (validacoes.validaTipo(ctx) == false) {
      let newError = new Error('tipo invalido');
      newError.status = 400;
      newError.code = 'Escolha um tipo válido';
      next(newError);
      return;
    } else {
      ctx.instance.tipo = 'tipo valido';
      next();
      return;
    }
  });
};
