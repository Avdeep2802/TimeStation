
var mysql = require('mysql');
var session = require('express-session');

exports.home = function(req, res){
  //res.render('home', { title: 'Express' });
  if(req.cookies.cook) {
	  console.log("redirect");
	  res.render('home', { title: '' });
	  } else {
		  res.render('index',{title : "Login To Continue"} );
	  }
};


exports.signup = function(req, res){
	
    var email = req.body.username;
    var pwd = req.body.password;
  
	var connection = mysql.createConnection({
		host : '127.0.0.1',
		user : 'root',
		password : 'root',
		database : 'golivelabs'
	});
	
	connection.connect(function(err) {
        if(err) {
            console.log(err);
            return;
        }
        else {
        console.log('success');
        }
	});

	var insert = {
			emailid : email,
			password : pwd[0],
	}
	
	connection.query("insert into user SET ?", insert,
			function(err,result){
					if(err){
						console.log("unable to insert");
						console.log(err);
						return;
					}
					else{
						console.log("data inserted");
					}
	});
//	sql = "INSERT INTO user (emailid, password) VALUES ('avdeep', 'avdeep')";
//	connection.query(sql, function(err, result){
//		if(err){
//			console.log("not inserted");
//		}
//		else
//			{
//			console.log("data inserted");
//			}
//	});
	connection.end();
	res.cookie('cook', email);
//	console.log(req.session.user);
	res.redirect('/home');

};

exports.logout = function(req, res){
	res.clearCookie('cook');
	res.render('index', { title: 'Login to Continue' });
};

exports.save = function(req, res){
    var text = req.body.username;
	var connection = mysql.createConnection({
		host : '127.0.0.1',
		user : 'root',
		password : 'root',
		database : 'golivelabs'
	});
	connection.connect(function(err) {
        if(err) {
            console.log(err);
            return;
        }
	});
	var insert = {
			text : text,
	}
	console.log(req.cookies.cook);
	console.log(text);
	connection.query('UPDATE user SET text = ? WHERE emailid = ?',[text, req.cookies.cook],
			function(err,result){
					if(err){
						console.log("unable to insert");
						console.log(err);
						return;
					}
					else{
						console.log("data inserted");
					}
	});
	connection.end();
	res.render('home', { title: '' });
}

