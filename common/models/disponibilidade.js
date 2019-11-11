'use strict';
const validacoes = require('../functions/validacoes');
const erros = require('../enum/statusError');
const request = require('request');

module.exports = function(Disponibilidade) {
  var app = require('../../server/server');
  Disponibilidade.disableRemoteMethodByName('patchOrCreate');
  Disponibilidade.disableRemoteMethodByName('findById');
  Disponibilidade.disableRemoteMethodByName('upsertWithWhere');
  Disponibilidade.disableRemoteMethodByName('count');
  Disponibilidade.disableRemoteMethodByName('findOne');
  Disponibilidade.disableRemoteMethodByName('findById');
  Disponibilidade.disableRemoteMethodByName('createChangeStream');
  Disponibilidade.disableRemoteMethodByName('exists');
  Disponibilidade.disableRemoteMethodByName('replaceOrCreate');
  Disponibilidade.disableRemoteMethodByName('prototype.patchAttributes');
  Disponibilidade.disableRemoteMethodByName('prototype.patchAttributes')
  Disponibilidade.disableRemoteMethodByName('createChangeStream');
  Disponibilidade.disableRemoteMethodByName('updateAll');
  Disponibilidade.disableRemoteMethodByName('replaceOrCreate');
  Disponibilidade.disableRemoteMethodByName('replaceById');
  Disponibilidade.disableRemoteMethodByName('destroyById');
 

  const disponibilidade = (ctx) => {
    return new Promise((resolve, reject) => {
    const Reserva = app.models.Reserva;
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
        }).then(prioridade1 => {
            if(prioridade1.length == 0){
              resolve(true)
          }
        resolve(false);
      });
    });
  };

  const ValidaPrimeiraPrioridade = ctx => {
    return new Promise((resolve, reject) => {
    const Reserva = app.models.Reserva;
    let filter =  Reserva.find({
      where:{
        tipo: { neq: ctx.instance.tipo},
        or: [
            {and:[{inicioEm : {lte:(ctx.instance.inicioEm)}},{fimEm:{gt:(ctx.instance.inicioEm)}},{or:[{status:'Ativa'},{status: 'Pago'}
                ]}]},
            {and:[{inicioEm : {lt:(ctx.instance.fimEm)}},{fimEm:{gte:(ctx.instance.fimEm)}},{or:[{status:'Ativa'}, {status: 'Pago'}
                ]} ]},
            {and:[{inicioEm : {gt:(ctx.instance.inicioEm)}},{fimEm:{lt:(ctx.instance.fimEm)}},{or:[{status:'Ativa'}, {status: 'Pago'}
                ]} ]}
        ]
    }
    }
    ).then(prioridade2 => {
      console.log(filter)
      if(prioridade2.length == 0 && (ctx.instance.tipo == "HARD" ? ctx.instance.tipo = "SAIBRO" : ctx.instance.tipo = "HARD" )){
            resolve(true);
      }
      resolve(false);
    })
   
  });
  }


  const ValidaSegundaPrioridade = ctx => {
    return new Promise((resolve, reject) => {
    const Reserva = app.models.Reserva;
    let inicio = ctx.instance.inicioEm;
    ctx.instance.fimEm = ctx.instance.inicioEm
    
    let where = {
      tipo: ctx.instance.tipo,
      and:[
        {fimEm: ctx.instance.fimEm.toISOString()},{inicioEm: validacoes.subHours(inicio).toISOString()},
        {
          or:[
            {status:'Ativa'},
            {status: 'Pago'}]
        },
      ]
    };
    console.log('where', where);
    Reserva.find({
      where
    }
    ).then(menosUmHora =>{
      console.log(menosUmHora);
      if(menosUmHora.length == 0){
            resolve(true);
      }
      resolve(false);
      ctx.instance.inicioEm = validacoes.addHours(inicio);
      ctx.instance.fimEm = validacoes.addHours(inicio);

    })
     
    })
   
  }


  const validaSegundaPiroridadeMaisUmaHora = ctx => {
   return new Promise((resolve, reject) => {
    const Reserva = app.models.Reserva;
    ctx.instance.inicioEm = ctx.instance.fimEm
    let fim = ctx.instance.fimEm;
    let where = {
      tipo: ctx.instance.tipo,
      and:[
        {inicioEm: ctx.instance.inicioEm.toISOString()},{fimEm: validacoes.addHours(fim).toISOString()},
        {
          or:[
            {status:'Ativa'},
            {status: 'Pago'}]
        },
      ]
    };
    console.log('where', where);
    Reserva.find({
      where
    }
    ).then(menosUmHora =>{
      console.log(menosUmHora);
      if(menosUmHora.length == 0){
            resolve(true);
      }
      resolve(false);
    })
     
    })
  }





  const ValidaTerceiraPrioridade = ctx => {
    return new Promise((resolve, reject) => {
    const Reserva = app.models.Reserva;
    let filter =  Reserva.find({
      where:{
        tipo: { neq: ctx.instance.tipo},
        or: [
            {and:[{fimEm: ctx.instance.inicioEm},{inicioEm: validacoes.subHours(inicio)},{or:[{status:'Ativa'}, {status: 'Pago'}]}]},
            {and:[{inicioEm: ctx.instance.fimEm},{fimEm: validacoes.addHours(fim)},{or:[{status:'Ativa'}, {status: 'Pago'}]}]}
        ]
    }
    }
    ).then(prioridade2 => {
      console.log(filter)
      if(prioridade2.length == 0 && (ctx.instance.tipo == "HARD" ? ctx.instance.tipo = "SAIBRO" : ctx.instance.tipo = "HARD" )){
            resolve(true);
      }
      resolve(false);
    })
   
  });
  }

  const ValidaQuartaPrioridade = ctx => {
    return new Promise((resolve, reject) => {
    const Reserva = app.models.Reserva;
    let addHoursFimEm = new Date().setHours(ctx.instance.fimEm.getHours() + 2 );
    let subHoursFimEm = new Date().setHours(ctx.instance.inicioEm.getHours() - 2 );
    Reserva.find({
      where:{
        tipo: ctx.instance.tipo,
        or: [
            {and:[{fimEm: ctx.instance.inicioEm},{inicioEm: new Date(subHoursFimEm)},{or:[{status:'Ativa'}, {status: 'Pago'}]}]},
            {and:[{inicioEm: ctx.instance.fimEm},{fimEm: new Date(addHours)},{or:[{status:'Ativa'}, {status: 'Pago'}]}]}
        ]
    }
    }
    ).then(prioridade4 => {
      if(prioridade4.length == 0){
            resolve(true);
      }
      resolve(false);
    })
   
  });
  }


  Disponibilidade.observe('before save', async function(ctx, next) {
    if (!ctx.instance) {
      next();
      return false;
    }
    let mesmoHorario = await disponibilidade(ctx);
    if (!mesmoHorario){
      let mesmoHorarioOutroTipo = await ValidaPrimeiraPrioridade(ctx);
        if (!mesmoHorarioOutroTipo){
          let segundaValidacaoMenosUmaHora = await ValidaSegundaPrioridade(ctx);
            if (!segundaValidacaoMenosUmaHora){
             let segundaValidacaoMaisUmaHora = await validaSegundaPiroridadeMaisUmaHora(ctx);
               if(!segundaValidacaoMaisUmaHora){
                next(erros.newError.HORARIO_INVALIDO)
                return false;
               }
       }
     }
  }
  });
};