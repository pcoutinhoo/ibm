const _newError = {
   400: {
     statusCode: '400',
     message: 'Tipo Invalido',
   },
   401: {
     statusCode: '400',
     message: 'Data Invalida',
   },
   402: {
     statusCode: '400',
     message: 'Status Invalido',
   },
   422: {
     statusCode: '422',
     message: 'Duracao Invalida',
   },
 };
 module.exports = {
   newError: _newError,
 };
