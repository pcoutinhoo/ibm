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
    // eslint-disable-next-line max-len
    } else if ((validacoes.validaInicioEm(ctx) == false) || (validacoes.validaFimEm(ctx) == false)) {
      let newError = new Error('Data invalida');
      newError.status = 400;
      newError.code = 'Escolha uma data válido';
      next(newError);
      return;
    }    else {
      ctx.instance.criadoEm = new Date().toISOString();
      ctx.instance.duracao = validacoes.duracao(ctx);
      ctx.instance.valor = ctx.instance.duracao * 0.5;
      next();
      return;
    }
  });
};
