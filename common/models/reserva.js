'use strict';

module.exports = function(Reserva) {
  Reserva.disableRemoteMethodByName('patchOrCreate');
  Reserva.disableRemoteMethodByName('findById');
  Reserva.disableRemoteMethodByName('upsertWithWhere');
  Reserva.disableRemoteMethodByName('count');
  Reserva.disableRemoteMethodByName('find');
  Reserva.disableRemoteMethodByName('findOne');
  Reserva.disableRemoteMethodByName('findById');
  Reserva.disableRemoteMethodByName('createChangeStream');
  Reserva.disableRemoteMethodByName('exists');
};
