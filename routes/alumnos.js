var Alumno;
var mongoose = require('mongoose');
var bds=['mongodb://lab3sd:lab3sd@192.168.50.11:27017/primer_base', 'mongodb://lab3sd:lab3sd@192.168.50.15:27017/primer_base']
exports.setModel = function(modelo){
	Alumno = modelo;
};
exports.index = function(req, res){
	/*Personaje.find({}, function(error, personajes){
		if(error){
			res.send('Ha surgido un error.');
		}else{
			res.render('personajes/index', {
				personajes: personajes
			});
		}
	})*/
	res.render('alumnos/index')
};
exports.create = function(req, res){
	res.render('alumnos/save', {
		put: false,
		action: '/alumnos/',
		alumno: new Alumno({
			nombre: '',
			apellido: '',
			rut: '',
			carrera: ''
		})
	});
};

exports.buscar = function(req, res){
	res.render('alumnos/buscar', {
		put: false,
		action: '/alumnos/buscar',
		alumno: new Alumno({
			nombre: '',
			apellido: '',
			rut: '',
			carrera: ''
		})
	});
};

exports.buscar1= function(req, res){
	var alumno = Alumno({
		rut: req.body.rut
	});
	var crypto = require('crypto');
	var sha1 = crypto.createHash('sha1').update(alumno.rut).digest("hex");
	var mod = require('hash-mod')(2);
	var idbd=mod(sha1);
	var consulta = {
				"rut": alumno.rut
			};
	mongoose.connect(bds[idbd], function(error){
		if(error){
			throw error;		
		}else{
			console.log('Conectado a MongoDB');
		}
	});

	var query = Alumno.findOne(consulta);

	// selecting the `name` and `occupation` fields
	query.select('nombre apellido carrera');

	// execute the query at a later time
	query.exec(function (err, alum) {
	  if (err) {console.log(err);}
	  	console.log('%s %s %s.', alum.nombre, alum.apellido, alum.carrera) 

		  mongoose.disconnect();
	})
	
}
exports.store = function(req, res){
	var alumno = new Alumno({
		nombre: req.body.nombre,
		apellido: req.body.apellido,
		rut: req.body.rut,
		carrera: req.body.carrera
	});
	var crypto = require('crypto');
	var sha1 = crypto.createHash('sha1').update(alumno.rut).digest("hex");
	console.log(alumno.rut)
	console.log(sha1);
	var mod = require('hash-mod')(2);
	console.log(mod(sha1))
	mongoose.connect(bds[mod(sha1)], function(error){
		if(error){
			throw error;		
		}else{
			console.log('Conectado a MongoDB');
		}
	});

	process.on('uncaughtException', function (err) {
    	console.log(err);
	});



	alumno.save(function(error, documento){
		if(error){
			res.send('Error al intentar guardar el alumno.');
			console.log(error)
		}else{	
			mongoose.disconnect();
			res.redirect('/alumnos');
		}

	});
	
};
exports.show = function(req, res){
	Alumno.findById(req.params.id, function(error, documento){
		if(error){
			res.send('Error al intentar ver el alumno.');
		}else{
			res.render('alumnos/show', {
				alumno: documento
			});
		}
	});
};
exports.edit = function(req, res){
	Alumno.findById(req.params.id, function(error, documento){
		if(error){
			res.send('Error al intentar ver el alumno.');
		}else{
			res.render('alumnos/save', {
				put: true,
				action: '/alumnos/' + req.params.id,
				alumno: documento
			});
		}
	});
};
exports.update = function(req, res){
	Alumno.findById(req.params.id, function(error, documento){
		if(error){
			res.send('Error al intentar modificar el alumno.');
		}else{
			var alumno = documento;
			alumno.nombre = req.body.nombre;
			alumno.apellido = req.body.apellido;
			alumno.rut = req.body.rut;
			alumno.carrera = req.body.carrera;
			alumno.save(function(error, documento){
				if(error){
					res.send('Error al intentar guardar el alumno.');
				}else{	
					res.redirect('/alumnos');
				}
			});
		}
	});
};
exports.destroy = function(req, res){
	Alumno.remove({_id: req.params.id}, function(error){
		if(error){
			res.send('Error al intentar eliminar el alumno.');
		}else{	
			res.redirect('/alumnos');
		}
	});
};
