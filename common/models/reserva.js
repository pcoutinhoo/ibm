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


  function _validaHorarioReserva (ctx) {
    return new Promise((resolve, reject) => {
      Reserva.find({
            where:{
                tipo: ctx.instance.tipo,
                or: [
                    {and:[{inicioEm : {lte:(ctx.instance.inicioEm)}},{fimEm:{gt:(ctx.instance.inicioEm)}},{or:[{status:'Ativa'},{status: 'Pago'}
                        ]}]},
                    {and:[{inicioEm : {lt:(ctx.instance.fimEm)}},{fimEm:{gte:(ctx.instance.fimEm)}},{or:[{status:'Ativa'}, {status: 'Pago'}
                        ]} ]},
                    {and:[{inicioEm : {gt:(ctx.instance.inicioEm)}},{fimEm:{lt:(ctx.instance.fimEm)}},{or:[{status:'Ativa'}, {status: 'Pago'}
                        ]} ]}
                ]
            }
        }).then(data => {
          if(data.length == 0 ){
              return resolve(true);
          }
          return resolve(false);    
      });
    })
  };

  Reserva.on('attached', function() {
    Reserva.deleteById = function(id, x, cb) {
      Reserva.updateAll({id: id},
        {status: 'Cancelada',
          canceladaEm: new Date().toISOString()}, cb);
    };
  });

  Reserva.observe('before save', async function(ctx, next) {
      if (!ctx.instance) {
        next();
        return false;
     }if (validacoes.validaTipo(ctx) == false) {
        next(erros.newError.TIPO_INVALIDO);
        return false;
    } if ((validacoes.validaInicioEm(ctx) == false) || (validacoes.validaFimEm(ctx) == false)) {
        next(erros.newError.DATA_INVALIDA);
        return false;
    } if (validacoes.status(ctx) == false) {
        next(erros.newError.STATUS_INVALIDO);
        return false;
    }
    ctx.instance.duracao = validacoes.duracao(ctx);
    if (validacoes.duracaoReserva(ctx) == false) {
      next(erros.newError.DURACAO_INVALIDA);
      return false;
    } 
    let validaHorario = await _validaHorarioReserva(ctx);
    if (!validaHorario){
      next(erros.newError.HORARIO_INVALIDO);
      return false;
    } 
    else {
        ctx.instance.criadoEm = new Date().toISOString();
        ctx.instance.valor = ctx.instance.duracao * 0.5;
      next();
      return;
    }
  });

};
