
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var alumnos = require('./routes/alumnos');
// mongoose.connect('mongodb://lab3sd:lab3sd@192.168.50.11:27017/primer_base', function(error){
// 	if(error){
// 		throw error;		
// 	}else{
// 		console.log('Conectado a MongoDB');
// 	}
// });

// process.on('uncaughtException', function (err) {
//     console.log(err);
// });


// var crypto = require('crypto');
// var sha1 = crypto.createHash('sha1').update('Apple').digest("hex");
// console.log(sha1);
var AlumnoSchema = mongoose.Schema({
	//id: {type: Number, required: true},
	nombre: {type: String, required: true},
	apellido: {type: String, required: true},
	rut: {type: String, required: true},
	carrera: {type: String, required: true}
});
var AlumnoModel = mongoose.model('Alumno', AlumnoSchema);
alumnos.setModel(AlumnoModel);

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/alumnos/sinresultado');
app.get('/alumnos', alumnos.index);
app.get('/alumnos/create', alumnos.create);
app.get('/alumnos/buscar', alumnos.buscar);
app.get('/alumnos/buscar2', alumnos.buscar2);
app.post('/alumnos', alumnos.store);
app.post('/alumnos/buscar', alumnos.buscar1);
app.post('/alumnos/buscar2', alumnos.buscar3);
app.get('/alumnos/:id', alumnos.show);
app.get('/alumnos/:id/edit', alumnos.edit);
app.put('/alumnos/:id', alumnos.update);
app.delete('/alumnos/:id', alumnos.destroy);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
