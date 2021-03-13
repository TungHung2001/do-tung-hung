var express = require('express')
var app = express()

var MongoClient = require('mongodb').MongoClient;

//var url = 'mongodb://localhost:27017';
var url =  "mongodb+srv://ASM2:123456abc@cluster0.irpgi.mongodb.net/test";

var publicDir = require('path').join(__dirname,'/public');
app.use(express.static(publicDir));

var hbs = require('hbs')
app.set('view engine','hbs')


var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }))



//npm install mongodb
app.get('/',async (req,res)=>{
    let client= await MongoClient.connect(url);
    let dbo = client.db("MyDatabase");
    let results = await dbo.collection("products").find({}).toArray();
    res.render('homepage',{model:results})
})
app.get('/new',(req,res)=>{
    res.render('newtoy')
})
app.post('/insert',async (req,res)=>{
    let error= "";
   
    let nameInput = req.body.productName;
    let priceInput = req.body.price;
    let colorInput = req.body.color;
    let newProduct = {productName : nameInput, price:priceInput, color:colorInput};
    if (priceInput<500){
        error +="error";
    }
    if (error){
        res.render('newtoy',{error:error});
    } else {
    let client= await MongoClient.connect(url);
    let dbo = client.db("MyDatabase");
    await dbo.collection("products").insertOne(newProduct);
    let results = await dbo.collection("products").find({}).toArray();
    res.render('homepage',{model:results})
    }
})

app.post('/search',async (req,res)=>{
    
    let client= await MongoClient.connect(url);
    let dbo = client.db("MyDatabase");
    let searchText = req.body.txtSearch;
    let results = await dbo.collection("products").
        find({productName: new RegExp(searchText,'i')}).toArray();
        
    res.render('homepage',{model:results})
})

app.get('/delete',async (req,res)=>{
    let client= await MongoClient.connect(url);
    let dbo = client.db("MyDatabase");
    let id = req.query.pid;
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id":ObjectID(id)};  
    
    await dbo.collection("products").deleteOne(condition);
    res.redirect('/');
})

var PORT = process.env.PORT || 5000
app.listen(PORT);
console.log("Server is running at " + PORT)