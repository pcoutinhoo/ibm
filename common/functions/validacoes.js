const moment = require('moment');

module.exports = {
  validaTipo: _validaTipo,
  validaInicioEm: _validaInicioEm,
  validaFimEm: _validaFimEm,
  duracao: _duracao,
  status: _status,
  duracaoReserva: _duracaoReserva,
  addHours: _addHours,
  subHours: _subHours,
};

const type = {
  SAIBRO: 'SAIBRO',
  HARD: 'HARD',
};
const status = {
  Ativa: 'Ativa',
  Cancelada: 'Cancelada',
  Pago: 'Pago',
  Disponivel: 'Disponivel',
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

function _duracao(ctx) {
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

function _addHours(ctx){
    let  data = moment(ctx.instance.fimEm).utc().add(((ctx.instance.duracao / 60) + 1), 'hours').format();
   return data;
}

function _subHours(ctx){
  let  data = moment(ctx.instance.inicioEm).utc().subtract(((ctx.instance.duracao / 60) + 1), 'hours').format();
  return data;
}

