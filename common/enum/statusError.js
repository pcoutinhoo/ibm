const _newError = {
   TIPO_INVALIDO: {
     statusCode: '400',
     message: 'Tipo Invalido',
   },
   DATA_INVALIDA: {
     statusCode: '400',
     message: 'Data Invalida',
   },
   STATUS_INVALIDO: {
     statusCode: '400',
     message: 'Status Invalido',
   },
   DURACAO_INVALIDA: {
     statusCode: '422',
     message: 'Duracao Invalida',
   },
   HORARIO_INVALIDO: {
    statusCode: '422',
    message: 'O horário solicitado não está disponível, favor selecione um outro horário.',
    code: "HORARIO_INVALIDO"
  },
 };
 module.exports = {
   newError: _newError,
 };
