
// eslint-disable-next-line strict
const reserva = require('../models/reserva');

module.exports = {
  validaTipo: _validaTipo,
  validaInicioEm: _validaInicioEm,
  validaFimEm: _validaFimEm,
  duracao: duracao,
};

const type = {
  SAIBRO: 'SAIBRO',
  HARD: 'HARD',
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
