'use strict';
const validacoes = require('../functions/validacoes');
const moment = require('moment');

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
        }).then(prioridadeUm => {
            if(prioridadeUm.length == 0){
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
    ).then(prioridadeDois => {
      if(prioridadeDois.length == 0 && (ctx.instance.tipo == "HARD" ? ctx.instance.tipo = "SAIBRO" : ctx.instance.tipo = "HARD" )){
            resolve(true);
      }
      resolve(false);
    })
   
  });
  }


  const ValidaSegundaPrioridadeMenosUmaHora = ctx => {
    return new Promise((resolve, reject) => {
    let fim = moment(ctx.instance.inicioEm).subtract(1,'hour');
    const Reserva = app.models.Reserva;
    Reserva.find({
      where:{
        tipo: ctx.instance.tipo,and:[{fimEm: fim},{inicioEm: validacoes.subHours(ctx)},{or:[{status:'Ativa'},{status: 'Pago'}]},]
      }
    }).then(menosUmHora =>{
      if(menosUmHora.length == 0){
        ctx.instance.fimEm = fim;
        ctx.instance.inicioEm = validacoes.subHours(ctx);
        ctx.instance.status = validacoes.status.Disponivel;
        resolve(true);
      }
      resolve(false);
    })
    })
  }


  const validaSegundaPiroridadeMaisUmaHora = ctx => {
    return new Promise((resolve, reject) => {
      const Reserva = app.models.Reserva;
      let inicio = moment(ctx.instance.fimEm).add(1,'hour');
      Reserva.find({
        where:{
          tipo: ctx.instance.tipo, and:[{inicioEm: inicio},{fimEm: validacoes.addHours(ctx)},{or:[{status:'Ativa'},{status: 'Pago'}]},]
        }
      }).then(maisUmHora =>{
        if(maisUmHora.length == 0){
          ctx.instance.inicioEm = inicio;
          ctx.instance.fimEm = validacoes.addHours(ctx); 
          ctx.instance.status = validacoes.status.Disponivel;
          resolve(true);
        }
        resolve(false);
      })
      })
  }


  const ValidaTerceiraPrioridadeMenosUmaHora = ctx => {
    return new Promise((resolve, reject) => {
      let fim = moment(ctx.instance.inicioEm).subtract(1,'hour');
      const Reserva = app.models.Reserva;
      Reserva.find({
        where:{
          tipo: {neq: ctx.instance.tipo},and:[{fimEm: fim},{inicioEm: validacoes.subHours(ctx)},{or:[{status:'Ativa'},{status: 'Pago'}]},]
        }
      }).then(prioridade2 => {
      if(prioridade2.length == 0){
            ctx.instance.tipo = ctx.instance.tipo == "HARD" ? ctx.instance.tipo = "SAIBRO" : ctx.instance.tipo = "HARD";
            ctx.instance.fimEm = fim;
            ctx.instance.inicioEm = validacoes.subHours(ctx);
            resolve(true);
      }
      resolve(false); 
    })
  });
  }

  const ValidaTerceiraPrioridadeMaisUmaHora = ctx => {
    return new Promise((resolve, reject) => {
    const Reserva = app.models.Reserva;
    let inicio = moment(ctx.instance.fimEm).add(1,'hour');
      Reserva.find({
        where:{
          tipo: {neq: ctx.instance.tipo}, and:[{inicioEm: inicio},{fimEm: validacoes.addHours(ctx)},{or:[{status:'Ativa'},{status: 'Pago'}]},]
        }
      }).then(prioridade4 => {
        if(prioridade4.length == 0){
          ctx.instance.tipo = ctx.instance.tipo == "HARD" ? ctx.instance.tipo = "SAIBRO" : ctx.instance.tipo = "HARD";
          ctx.instance.inicioEm = inicio;
          ctx.instance.fimEm = validacoes.addHours(ctx); 
          resolve(true);
      }
      resolve(false)
    })
   
  });
  }

  const ValidaQuartaPrioridadeMenosDuasHora = ctx => {
    
    return new Promise((resolve, reject) => {
      let fim = moment(ctx.instance.inicioEm).subtract(2,'hour').format();
      let inicio = moment(fim).utc().subtract((ctx.instance.duracao / 60), 'hours').format();
      const Reserva = app.models.Reserva;
      Reserva.find({
        where:{
          tipo: ctx.instance.tipo,and:[{fimEm: fim},{inicioEm: inicio},{or:[{status:'Ativa'},{status: 'Pago'}]},]
        }
      }).then(menosUmHora =>{
        if(menosUmHora.length == 0){
          ctx.instance.fimEm = fim;
          ctx.instance.inicioEm = inicio;
          resolve(true);
        }
        resolve(false);
      })
      })
   
  }

  const validaQuartaPiroridadeMaisDuasHora = ctx => {
    return new Promise((resolve, reject) => {
      let inicio = moment(ctx.instance.fimEm).utc().add(2, 'hours').format();
      let fim = moment(inicio).add((ctx.instance.duracao / 60),'hours').format();
      const Reserva = app.models.Reserva;
      Reserva.find({
        where:{
          tipo: ctx.instance.tipo,and:[{fimEm: fim},{inicioEm: inicio},{or:[{status:'Ativa'},{status: 'Pago'}]},],
        }
      }).then(menosUmHora =>{
        if(menosUmHora.length === 0){
          ctx.instance.inicioEm = inicio;
          ctx.instance.fimEm = fim;
          resolve(true);
        }
        resolve(false);
      })
      })
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
          let segundaValidacaoMenosUmaHora = await ValidaSegundaPrioridadeMenosUmaHora(ctx);
            if (!segundaValidacaoMenosUmaHora){
             let segundaValidacaoMaisUmaHora = await validaSegundaPiroridadeMaisUmaHora(ctx);
               if(!segundaValidacaoMaisUmaHora){
                  let terceiraValidacaoMenosUmaHora = await ValidaTerceiraPrioridadeMenosUmaHora(ctx);
                  if(!terceiraValidacaoMenosUmaHora){
                    let terceiraValidacaoMaisUmaHora = await ValidaTerceiraPrioridadeMaisUmaHora(ctx);
                    if(!terceiraValidacaoMaisUmaHora){
                      let quartaValidacaoMenosDuasHora = await ValidaQuartaPrioridadeMenosDuasHora(ctx);
                      if(!quartaValidacaoMenosDuasHora){
                        let quartaValidacaoMaisDuasHora = await validaQuartaPiroridadeMaisDuasHora(ctx);
                        if(!quartaValidacaoMaisDuasHora){
                           next({})
                          return false;
                        } 
                      }
                      
                    }
                  }
                  
               }
       }
     }
  }
  });
};