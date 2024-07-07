const express = require('express');
const axios = require('axios');
const app = express();
const port = 3004
const request = require('request');
var passwordHash = require('password-hash');
var bodyParser = require('body-parser');
const {initializeApp , cert} = require('firebase-admin/app');
const { getFirestore }  = require('firebase-admin/firestore');

var serviceAccount = require('./key.json');

initializeApp({
    credential: cert(serviceAccount),
  })

const db = getFirestore();

app.use(bodyParser.json())

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }))

app.set('view engine', 'ejs');

app.get('/',(req,res)=>{
  res.render('dashboard')
})

app.get('/userlogin',(req,res)=>{
  res.render('userlogin')
})

app.get('/logout',(req, res)=>{
  res.render('logout')
})

app.get('/logout',(req, res)=>{
  req.session.destroy();
  res.render('logout')

})

app.get('/adminlogin',(req, res)=>{
  res.render('adminlogin')
})

app.get('/signup', (req, res)=>{
  res.render('signup')
})

app.post('/signupsubmit', (req, res) => {
    
    console.log(req.body);
    const fullname = req.body.fullname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const password = req.body.password;
    const libraryname = req.body.libraryname;
    const librarybranch = req.body.librarybranch;
    const identity = req.body.identity;
    const registerno = req.body.registerno;
    const adminid = req.body.adminid;
  db.collection("signups")
  .where("email" ,"==",email)

  .get()
  .then((docs)=>{
    if (docs.size>0){
      res.send("<div style='background-color: #ffcccc; color: #cc0000; padding: 10px; border-radius: 5px; text-align: center; font-size: 18px; font-weight: bold;'>Account already exists!!</div>")
    }
    else{
      db.collection('signups').add({
        name : fullname + lastname,
        email: email,
        password:passwordHash.generate(password),
        libraryname: libraryname,
        librarybranch : librarybranch,
        identity : identity,
        registerno : registerno,
        adminid : adminid

      })
      .then(() => {
        if (identity === "admin") {
          res.render('adminlogin');
        } else if (identity === "user") {
          res.render('userlogin');
        } else {
          res.send("<div style='background-color: #ffcccc; color: #cc0000; padding: 10px; border-radius: 5px; text-align: center; font-size: 18px; font-weight: bold;'>Something went wrong :(</div>");
;
        }
      });      
    }
  })
  });
  
app.post('/done', (req, res) => {
  const bookname = req.body.bookname;
  const dateofissue = req.body.dateofissue;
  const accountnumber = req.body.accountnumber;
  const callnumber = req.body.callnumber;
      
  db.collection('admins')
      .add({
          bookname: bookname,
          dateofissue: dateofissue,
          callnumber : callnumber,
          accountnumber : accountnumber,
      })
      .then(() => {
          res.render('done');
      })
      .catch((error) => {
          console.error('Error:', error);
          res.status(500).send("<div style='background-color: #ffcccc; color: #cc0000; padding: 10px; border-radius: 5px; text-align: center; font-size: 18px; font-weight: bold;'>Internal server error</div>");
;
      });
});

app.post('/userloginsubmit', (req,res)=>{
  console.log(req.body)
  const email = req.body.email;
  const password = req.body.password;
  const registerno = req.body.registerno;
  db.collection('signups')
    .where('email', "==" ,email)
    .where('registerno', "==" ,registerno)
    .get()
    .then((docs)=>{
      let verified = false;

      docs.forEach(doc=>{
        verified = passwordHash.verify(password,doc.data().password);
        console.log(doc.id, "=>" , doc.data());
      })
      console.log(docs);
      if(verified){
        res.render('userhome');
      }
      else{
        res.send("<div style='background-color: #ffcccc; color: #cc0000; padding: 10px; border-radius: 5px; text-align: center; font-size: 18px; font-weight: bold;'>Login failed</div>");
;
      }
    });
      
    });

app.post('/adminloginsubmit', (req,res)=>{
  console.log(req.body)
  const email = req.body.email;
  const password = req.body.password;
  const adminid = req.body.adminid;
  db.collection('signups')
    .where('email', "==" ,email)
    .where('adminid', "==" ,adminid)
    .get()
    .then((docs)=>{
      let verified = false;

      docs.forEach(doc=>{
        verified = passwordHash.verify(password,doc.data().password);
        console.log(doc.id, "=>" , doc.data());
      })
      console.log(docs);
      if(verified){
        res.render('adminhome', {result:null});
      }
      else{
        res.send("<div style='background-color: #ffcccc; color: #cc0000; padding: 10px; border-radius: 5px; text-align: center; font-size: 18px; font-weight: bold;'>Login failed</div>");
;
      }
    });
    
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
  