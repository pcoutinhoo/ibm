/* eslint-disable semi */
'use strict';
const validacoes = require('../functions/validacoes');
const erros = require('../enum/statusError');

module.exports = function(Reserva) {
  Reserva.disableRemoteMethodByName('patchOrCreate');
  Reserva.disableRemoteMethodByName('findById');
  Reserva.disableRemoteMethodByName('upsertWithWhere');
  Reserva.disableRemoteMethodByName('count');
  Reserva.disableRemoteMethodByName('findOne');
  Reserva.disableRemoteMethodByName('findById');
  Reserva.disableRemoteMethodByName('createChangeStream');
  Reserva.disableRemoteMethodByName('exists');

  Reserva.on('attached', function() {
    Reserva.deleteById = function(id, x, cb) {
      Reserva.updateAll({id: id},
        {status: 'Cancelada',
          canceladaEm: new Date().toISOString()}, cb);
    };
  });
  Reserva.observe('before save', function(ctx, next) {
     if (!ctx.instance) {
      next();
      return;
    }if (validacoes.validaTipo(ctx) == false) {
      next(erros.newError[400]);
      return;
    } if ((validacoes.validaInicioEm(ctx) == false) || (validacoes.validaFimEm(ctx) == false)) {
      next(erros.newError[401]);
      return;
    } if (validacoes.status(ctx) == false) {
      next(erros.newError[402]);
      return;
    }
    ctx.instance.duracao = validacoes.duracao(ctx);
    if (validacoes.duracaoR(ctx) == false) {
      next(erros.newError[422]);
      return;
    }    else {
      ctx.instance.criadoEm = new Date().toISOString();
      ctx.instance.valor = ctx.instance.duracao * 0.5;
      next();
      return;
    }
  });
};
