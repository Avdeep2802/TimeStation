
var mysql = require("mysql");
var session = require('express-session');
var sess;

exports.authenticate = function(req, res){
    
	sess = req.session;
	
	var email = req.body.username;
	var pwd = req.body.password;

	
	var logininfo = {
			emailid : email,
			}
	
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
        
	connection.query('SELECT * FROM user where emailid =?',email, function(err, rows, fields){
		if(err)
			{
				console.log("error while performing query");
//				res.render('login',{title : "Invalid Email Id"} );
			}
		
		if (rows.length == 0)
			{
				res.render('index',{title : "Invalid Email Id"} );
			}
		else
			{
				
				if(pwd == rows[0].password)
					{
						sess.emailid= email;
						res.cookie('cook', email);
						//console.log(req.cookies.cook + " is the cookie");
						//console.log(sess.emailid + " is set in session");
						res.redirect('/home');
					}
				else
					{
						res.render('index',{title : "Invalid Password"} );
					}
			}
	});
	connection.end();
};

exports.index = function(req, res){
	
	//sess = req.session;
	
	// if(req.cookies.cook) {
	// 	console.log("home vala redirect chal ya");
	//     res.redirect('/home');
	//   } else {
	// 	  console.log("home vala redirect nae chalya ");
	// 	  res.render('index',{title : "Login To Continue"} );
	//   }
	res.render('index',{title : "Login To Continue"} );
};

exports.login = function(req, res){
	if(req.cookies.cook)
	{
		res.clearCookie('cook');
	}
	res.render('index',{title : "Login To Continue"} );
}

