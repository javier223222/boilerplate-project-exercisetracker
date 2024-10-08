const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const userRouter=require("./usuarios/infraestructure/http/Usuarios.Controller").router



const mongoose = require('mongoose');

main().then(()=>{
  console.log('Connected to MongoDB');
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_URI);

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))
app.use(userRouter)
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});





const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
