const { MongoClient } = require('mongodb')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const URL = 'mongodb+srv://hieuln:hieu140499@hieuln.hy712.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
//const URL ='mongodb+srv://Hieulngbh:0977953600@cluster0.avzfi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
async function connect(){
    const client = await MongoClient.connect(URL)
    const dbo = client.db("GCH0803")
    return dbo 
}

async function Log (nameIn, passIn){
    const dbo = await connect()
    const user = await dbo.collection("ACCOUNT").findOne({ name: nameIn, pass: passIn})
    return user
}
async function Search (nameIn){
    const dbo = await connect()
    const user = await dbo.collection("ACCOUNT").findOne({ name: nameIn})
    return user
}

async function Compare (nameIn,passIn){
    const dbo = await connect()
    const user = await dbo.collection("ACCOUNT").findOne({ name: nameIn})
    console.log(user.pass)
    bcrypt.compare(passIn, user.pass, function(err, result) {
        // result == true
        console.log(result)
        if(result){
            return "1"
        }
        else{
            return "-1"
        }
   });
    
}

async function Insert(nameIn, passIn){
    const dbo = await connect()
    await dbo.collection("ACCOUNT").insertOne({ name: nameIn, pass: passIn })
}

module.exports ={ Insert, Log, connect, Search, Compare}