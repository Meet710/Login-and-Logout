var express = require('express');
var router = express.Router();
var User = require('../models/user');
var moment =require('moment')
var now=moment()
router.get('/', function (req, res) {
	return res.render('index.ejs');
});


router.post('/', function (req, res) {
	
	var personInfo = req.body;
	// var d=new Date(personInfo.DateofBirth)
	console.log(req.body.DateofBirth)
	var date=moment(req.body.DateofBirth).format('DD-MM-YYYY')
    console.log(date)

	if (!personInfo.email || !personInfo.username || !personInfo.password || !personInfo.passwordConf) {
		res.send();
	} else {
		if (personInfo.password == personInfo.passwordConf) {

			User.findOne({ email: personInfo.email }, function (err, data) {
				if (!data) {
					var unique;
					User.findOne({}, function (err, data) {

						if (data) {
						unique= data.unique_id + 1;
						} else {
							unique = 1;
						}

						var newPerson = new User({
							unique_id: unique,
							name: personInfo.name,
							email: personInfo.email,
							username: personInfo.username,
							password: personInfo.password,
							passwordConf: personInfo.passwordConf,
							DateofBirth:date,
							role:personInfo.role,
							Address: personInfo.Address
						});

						newPerson.save(function (err, Person) {
							if (err)
								console.log(err);
							else
								console.log('Success');
						});

					}).sort({ _id: -1 }).limit(1);
					res.send({ "Success": "You are regestered,You can login now." });
				} else {
					res.send({ "Success": "Email is already used." });
				}

			});
		} else {
			res.send({ "Success": "password is not matched" });
		}
	}
});

router.get('/login', function (req, res) {
	return res.render('login.ejs');
});

router.post('/login', function (req, res) {
	//console.log(req.body);
	User.findOne({ email: req.body.email }, function (err, data) {
		if (data) {

			if (data.password == req.body.password) {
				//console.log("Done Login");
				if(data.role=='Admin'){
				req.session.userId = data.unique_id;
				//console.log(req.session.userId);
				res.send({ "Success": "Success!" });
				}
				else{
					res.send({"Success": "You are not admin"})
				}

			} else {
				res.send({ "Success": "Wrong password!" });
			}
		} else {
			res.send({ "Success": "This Email Is not regestered!" });
		}
	});
});

router.get('/profile', isLoggedIn, function (req, res) {
	User.find({}, { password: 0, id: 0, passwordConf: 0 }, function name(err, data) {
		if (err) {
			console.log(err);
		}
		else {
			return res.render('data', { data: data });
		}
	})


})
router.get('/logout', function (req, res, next) {
	console.log("logout")
	if (req.session) {
		
		req.session.destroy(function (err) {
			if (err) {
				return next(err);
			} else {
				return res.redirect('/login');
			}
		});
	}
});

router.get('/forgetpass', function (req, res) {
	res.render("forget.ejs");
});

router.post('/forgetpass', function (req, res) {
	//console.log('req.body');
	//console.log(req.body);
	User.findOne({ email: req.body.email }, function (err, data) {
		console.log(data);
		if (!data) {
			res.send({ "Success": "This Email Is not regestered!" });
		} else {
			// res.send({"Success":"Success!"});
			if (req.body.password == req.body.passwordConf) {
				data.password = req.body.password;
				data.passwordConf = req.body.passwordConf;

				data.save(function (err, Person) {
					if (err)
						console.log(err);
					else
						console.log('Success');
					return res.send({ "Success": "Password changed!" });
				});
			} else {
				res.send({ "Success": "Password does not matched! Both Password should be same." });
			}
		}
	});

});

router.get('/delete/:email', function (req, res) {
	const { email } = req.params
	User.deleteOne({ email }, function (err, data) {
		if (data) {
			res.redirect('/profile')
		}
		else {
			console.log(err.message)
		}
	})
})

function isLoggedIn(req,res,next) {
	if(req.session.userId){
		return next();
	}
	else{
		res.redirect('/login');
	}
}
module.exports = router;