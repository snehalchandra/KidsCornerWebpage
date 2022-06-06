
var express=require("express"); 
var bodyParser=require("body-parser"); 
const bcrypt = require("bcryptjs");
const mongoose = require('mongoose'); 
mongoose.connect('mongodb://localhost:27017/KidsCorner'); 
console.log("Just after mongoose");
var db=mongoose.connection; 
db.on('error', console.log.bind(console, "connection error")); 
db.once('open', function(callback){ 
	console.log("connection succeeded"); 
}) 

var app=express() 
const router1=express.Router();
const router2=express.Router()
app.use(bodyParser.json()); 
app.use(express.static('public')); 
app.use(bodyParser.urlencoded({ 
	extended: false
})); 

app.post('/sign_up', function(req,res){ 
    var firstName = req.body.firstName; 
    var lastName = req.body.lastName; 
	var email =req.body.email; 
	var pass = req.body.password; 
	var check= req.body.check;
	/*	let user = db.collection('Client_Reg').findOne({email})
	   Promise.resolve(user).then(()=>{
		if(user) {
			console.log(user)
			console.log("User exists")
			return res.status(400).json({
				msg: "User Already Exists"
			});
		}
		})*/
	var data = { 
        "fname": firstName, 
        "lname": lastName,
		"email":email, 
    	"password":pass, 
		"check":check,
		 
	} 
	var pass_hash=JSON.stringify(pass)
	var salt = bcrypt.genSaltSync(10);
	data.password = bcrypt.hashSync(req.body.password, 10, function(err, hash) {
		if (err) { throw (err); }
	
		bcrypt.compare(req.body.password, hash, function(err, result) {
			if (err) { throw (err); }
			console.log(result);
		});
	});
	console.log(data.password)
db.collection('Client_Reg').insertOne(data,function(err, collection){ 
		if (err) throw err; 
		console.log("Record inserted Successfully"); 
		//res.send("Sign Up Successful")
	}); 
		
	return res.redirect('http://localhost:3000/signupsuccess'); 
}) 
/*
app.post('/sign_in',function(req,res)
{
	console.log("Sign in called")
	var email =req.body.email; 
	var pass = req.body.password; 
	var data = { 
		"email":email, 
		"password":pass, 
	} 
	db.collection('Client_Reg').findOne(data.email,function(err, collection){ 
		if (err) throw err; 
		if(bcrypt.compare(data.password,collection.password))
		{
			console.log("Signed in Successfully"); 
			res.send("Sign In Successful")
		}
		
		//res.send("Sign Up Successful")
	}); 
})*/
app.get('/',function(req,res){ 
	console.log("in the app.get function");
res.set({ 
	'Access-control-Allow-Origin': '*'
	}); 
return res.redirect('http://localhost:3000/signup'); 

}).listen(3001) 


console.log("server listening at port 3000"); 
