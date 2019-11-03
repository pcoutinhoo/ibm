const reserva = require('../models/reserva');

module.exports = {
  validaTipo: _validaTipo,
  validaInicioEm: _validaInicioEm,
  validaFimEm: _validaFimEm,
  duracao: duracao,
  status: _status,
  duracaoR: _duracaoReserva,
  //validaReserva: _validaReserva,
};

const type = {
  SAIBRO: 'SAIBRO',
  HARD: 'HARD',
};
const status = {
  Ativa: 'Ativa',
  Cancelada: 'Cancelada',
  Pago: 'Pago',
};
function _validaTipo(ctx) {
  if (type[ctx.instance.tipo]) {
    return true;
  }
  return false;
}

function _validaInicioEm(ctx) {
  if (new Date(ctx.instance.inicioEm) != 'Invalid Date') {
    ctx.instance.inicioEm = new Date(ctx.instance.inicioEm);
    return true;
  }
  return false;
}
function _validaFimEm(ctx) {
  if (new Date(ctx.instance.fimEm) != 'Invalid Date') {
    ctx.instance.fimEm = new Date(ctx.instance.fimEm);
    return true;
  }
  return false;
}

function duracao(ctx) {
  let fim  = ctx.instance.fimEm.getTime();
  let inicio = ctx.instance.inicioEm.getTime();
  let duracao = ((fim - inicio) / 3600000) * 60;
  return duracao;
}

function _status(ctx) {
  if (status[ctx.instance.status]) {
    return true;
  }
  return false;
}

function _duracaoReserva(ctx) {
  if ((ctx.instance.duracao % 60 == 0) && (ctx.instance.fimEm.getTime() > ctx.instance.inicioEm.getTime())) {
    return true;
  } return false;
}


// const _validaReserva = async (ctx) => {
//     return new Promise(resolve, reject) => {
//         reserva.find({
//         where: {
//             and : [{inicioEm: {lte:{ctx.instance.inicioEm.toIsoString()}}}, {fimEm : {lt:{ctx.instance.inicioEm.toIsoString()}}}],
//         }
//     })
//         .then(dados =>{
//             if(dados.lenght === 0){
//                 return resolve(true);
//             }
//             return resolve(false);
//         })
//     }

// }

