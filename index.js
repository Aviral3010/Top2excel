const exp = require('constants')
const express = require('express')
const path = require('path')
var bodyParser = require('body-parser');
var ejs = require('ejs');
var mongoClient = require('mongodb').MongoClient;
const { relative } = require('path');
var url = "mongodb://localhost:27017/";
const session = require('express-session');
const { throws } = require('assert');
const { MongoParseError } = require('mongodb');
const app = express()

app.use(session({ 
    secret: 'test', 
    saveUninitialized: true, 
    resave: true }));

app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'index.html'))
// })
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))

})
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signup', (req, res) => {
    var user_name = req.body.usname;
    var user_dob = req.body.dob;
    var user_email = req.body.email;
    var user_address = req.body.address;
    var user_mobile = req.body.mobile;
    var user_gender = req.body.gender;
    var user_password = req.body.password;
    var user_apply_date = new Date();
    var depObj = {
        'name': user_name,
        'DOB': user_dob,
        'email': user_email,
        'address': user_address,
        'mobile': user_mobile,
        'gender': user_gender,
        'password': user_password,
        'apply date': user_apply_date
    }

    // console.log(user_email, user_name, user_message)
    mongoClient.connect(url, function (err, db) {
        if (err) throw err;

        var dbCon = db.db("onlineExam");


        // var depObj = {
        //     'name': user_name,
        //     'DOB': user_dob,
        //     'email': user_email,
        //     'address': user_address,
        //     'mobile': user_mobile,
        //     'gender': user_gender,
        //     'password': user_password,
        //     'apply date': user_apply_date
        // }



        var dbscollection = dbCon.collection("UserInformation")

        dbscollection.insertOne(depObj, function (err, res) {
            if (err) throw err;
            console.log(" record inserted");
            db.close();
        });
    });
    // ins(depObj)
    res.redirect('/')
    //  res.send('<script>window.location.href="/index.html";</script>')
})
// var retrieve;
app.post('/login', (req, res) => {
    var user_password = req.body.password;
    var user_name = req.body.username;
    var use = {
        "email": user_name,
        "password": user_password
    }
    mongoClient.connect(url, function (err, db) {
        if (err) throw err;

        var dbo = db.db("onlineExam");
        dbo.collection("UserInformation").findOne(use, function (err, result) {
            if (err) throw err;
            console.log('running')
            console.log(result);
            if (!result) {
                // res.status(401)
                res.redirect("/opps.html")
            } else {
                // res.redirect('/home.html')
                req.session.email = result.email;
                req.session.name = result.name;
                res.render('home.ejs', {
                    username: result.name
                })
            }


            db.close();
        })

    })
})

app.get('/home', (req, res) => {
    if (req.session.name) {
        res.render('home.ejs', {
            username: req.session.name
        })
    } else {
        res.redirect('/opps2.html')
    }
})

function reit(query) {
    console.log(query);
    var da = { user: query }
    mongoClient.connect(url, (err, db) => {
        if (err) throw err;
        var dob = db.db("score_card");
        dob.collection("score").findOne(da, (err, result) => {

            if (err) throw err;
            // console.log(result.score);
            return result.score
        })
    })
}
// reit()





app.get('/pro', (req, res) => {
    var curentuse = req.session.email;
    var use = { 'email': curentuse }
    // var score = reit(curentuse);
    // console.log( "score"+score);
    mongoClient.connect(url, function (err, db) {
        if (err) throw err;

        var dbo = db.db("onlineExam");
        dbo.collection("UserInformation").findOne(use, function (err, result) {
            // console.log("asddas" + score);
            if (err) throw err;
            console.log('running')
            console.log(result);
            var data = {
                mobile: result.mobile,
                username: result.name,
                email: result.email,
                dob: result.DOB,
                loc: result.address,
                doj: result.DOB,
            }
            res.render('profile.ejs', data)
            db.close();
        })

    })
})

app.get('/score', (req, res) => {
    var curentuse = req.session.email;
    var use = { 'user': curentuse }
    mongoClient.connect(url, (err, db) => {
        if (err) throw err;
        var dob = db.db("score_card");
        dob.collection("score").find(use).toArray( (err, result) => {

            if (err) throw err;
            var mathsco=0
            var mocksco=0
            var gksco=0
            
            // console.log(result.score);
            //  data= {scoreMok:(result.score)*10,scoreMath:}
             for(var obj of result){
                if (obj.test==="Mock Test"){
                    mocksco=(obj.score)*10;
                }else if(obj.test==="Math"){
                    mathsco=(obj.score)*10
                }else if(obj.test==="GK"){
                    gksco=(obj.score)*10
                }
             }
             data={
                username:req.session.name,
                 scoreMok:mocksco,
                 scoreMath : mathsco,
                 scoreGK:gksco
            }
             res.render('score1.ejs', data)
            })
            // db.close();

    })

})



app.get('/test', (req, res) => {

    // if (err) throw err;
    mongoClient.connect(url, function (err, db) {
        if (err) throw err;

        var dbo = db.db("question");
        dbo.collection("gs").find({}).toArray(function (err, result) {
            if (err) throw err;
            // console.log('running')
            console.log(result);
            // for (var sett of result){
            //     var question=sett.ques
            //     var options=sett.option

            // }
            res.render('card.ejs', {
                question: result[0].ques,
                op1: result[0].option[0],
                op2: result[0].option[1],
                op3: result[0].option[2],
                op4: result[0].option[3]

            })

            db.close();
        })
    })
})



app.get("/testmock", (req, res) => {
    // console.log(req.params.av);
    mongoClient.connect(url, function (err, db) {

        if (err) throw err;

        var dbo = db.db("question")

        dbo.collection("gs").find({}).toArray(function (err, result) {

            if (err) throw err;

            var qobj = {

                test:"Mock Test",

                q1: result[0].ques,
                q1o1: result[0].option[0],
                q1o2: result[0].option[1],
                q1o3: result[0].option[2],
                q1o4: result[0].option[3],

                q2: result[1].ques,
                q2o1: result[1].option[0],
                q2o2: result[1].option[1],
                q2o3: result[1].option[2],
                q2o4: result[1].option[3],

                q3: result[2].ques,
                q3o1: result[2].option[0],
                q3o2: result[2].option[1],
                q3o3: result[2].option[2],
                q3o4: result[2].option[3],

                q4: result[3].ques,
                q4o1: result[3].option[0],
                q4o2: result[3].option[1],
                q4o3: result[3].option[2],
                q4o4: result[3].option[3],


                q5: result[4].ques,
                q5o1: result[4].option[0],
                q5o2: result[4].option[1],
                q5o3: result[4].option[2],
                q5o4: result[4].option[3],
                
                
                q6: result[5].ques,
                q6o1: result[5].option[0],
                q6o2: result[5].option[1],
                q6o3: result[5].option[2],
                q6o4: result[5].option[3],
                
                q7: result[6].ques,
                q7o1: result[6].option[0],
                q7o2: result[6].option[1],
                q7o3: result[6].option[2],
                q7o4: result[6].option[3],


                q8: result[7].ques,
                q8o1: result[7].option[0],
                q8o2: result[7].option[1],
                q8o3: result[7].option[2],
                q8o4: result[7].option[3],
                
                q9: result[8].ques,
                q9o1: result[8].option[0],
                q9o2: result[8].option[1],
                q9o3: result[8].option[2],
                q9o4: result[8].option[3],
                
                q10: result[9].ques,
                q10o1: result[9].option[0],
                q10o2: result[9].option[1],
                q10o3: result[9].option[2],
                q10o4: result[9].option[3],


            }

            res.render("ques.ejs", qobj)

        })

    })

})


app.get("/testmath", (req, res) => {
    // console.log(req.params.av);
    mongoClient.connect(url, function (err, db) {

        if (err) throw err;

        var dbo = db.db("question")

        dbo.collection("math").find({}).toArray(function (err, result) {

            if (err) throw err;

            var qobj = {

                test:"Math",

                q1: result[0].ques,
                q1o1: result[0].option[0],
                q1o2: result[0].option[1],
                q1o3: result[0].option[2],
                q1o4: result[0].option[3],

                q2: result[1].ques,
                q2o1: result[1].option[0],
                q2o2: result[1].option[1],
                q2o3: result[1].option[2],
                q2o4: result[1].option[3],

                q3: result[2].ques,
                q3o1: result[2].option[0],
                q3o2: result[2].option[1],
                q3o3: result[2].option[2],
                q3o4: result[2].option[3],

                q4: result[3].ques,
                q4o1: result[3].option[0],
                q4o2: result[3].option[1],
                q4o3: result[3].option[2],
                q4o4: result[3].option[3],


                q5: result[4].ques,
                q5o1: result[4].option[0],
                q5o2: result[4].option[1],
                q5o3: result[4].option[2],
                q5o4: result[4].option[3],
                
                
                q6: result[5].ques,
                q6o1: result[5].option[0],
                q6o2: result[5].option[1],
                q6o3: result[5].option[2],
                q6o4: result[5].option[3],
                
                q7: result[6].ques,
                q7o1: result[6].option[0],
                q7o2: result[6].option[1],
                q7o3: result[6].option[2],
                q7o4: result[6].option[3],


                q8: result[7].ques,
                q8o1: result[7].option[0],
                q8o2: result[7].option[1],
                q8o3: result[7].option[2],
                q8o4: result[7].option[3],
                
                q9: result[8].ques,
                q9o1: result[8].option[0],
                q9o2: result[8].option[1],
                q9o3: result[8].option[2],
                q9o4: result[8].option[3],
                
                q10: result[9].ques,
                q10o1: result[9].option[0],
                q10o2: result[9].option[1],
                q10o3: result[9].option[2],
                q10o4: result[9].option[3],


            }

            res.render("ques.ejs", qobj)

        })

    })

})

app.get("/testgk", (req, res) => {
    // console.log(req.params.av);
    mongoClient.connect(url, function (err, db) {

        if (err) throw err;

        var dbo = db.db("question")

        dbo.collection("gk").find({}).toArray(function (err, result) {

            if (err) throw err;

            var qobj = {

                test:"GK",

                q1: result[0].ques,
                q1o1: result[0].option[0],
                q1o2: result[0].option[1],
                q1o3: result[0].option[2],
                q1o4: result[0].option[3],

                q2: result[1].ques,
                q2o1: result[1].option[0],
                q2o2: result[1].option[1],
                q2o3: result[1].option[2],
                q2o4: result[1].option[3],

                q3: result[2].ques,
                q3o1: result[2].option[0],
                q3o2: result[2].option[1],
                q3o3: result[2].option[2],
                q3o4: result[2].option[3],

                q4: result[3].ques,
                q4o1: result[3].option[0],
                q4o2: result[3].option[1],
                q4o3: result[3].option[2],
                q4o4: result[3].option[3],


                q5: result[4].ques,
                q5o1: result[4].option[0],
                q5o2: result[4].option[1],
                q5o3: result[4].option[2],
                q5o4: result[4].option[3],
                
                
                q6: result[5].ques,
                q6o1: result[5].option[0],
                q6o2: result[5].option[1],
                q6o3: result[5].option[2],
                q6o4: result[5].option[3],
                
                q7: result[6].ques,
                q7o1: result[6].option[0],
                q7o2: result[6].option[1],
                q7o3: result[6].option[2],
                q7o4: result[6].option[3],


                q8: result[7].ques,
                q8o1: result[7].option[0],
                q8o2: result[7].option[1],
                q8o3: result[7].option[2],
                q8o4: result[7].option[3],
                
                q9: result[8].ques,
                q9o1: result[8].option[0],
                q9o2: result[8].option[1],
                q9o3: result[8].option[2],
                q9o4: result[8].option[3],
                
                q10: result[9].ques,
                q10o1: result[9].option[0],
                q10o2: result[9].option[1],
                q10o3: result[9].option[2],
                q10o4: result[9].option[3],


            }

            res.render("ques.ejs", qobj)

        })

    })

})


app.post('/testSubmit/:test', (req, res) => {
    var qv1 = req.body.qval1;
    var qv2 = req.body.qval2;
    var qv3 = req.body.qval3;
    var qv4 = req.body.qval4;
    var qv5 = req.body.qval5;
    var qv6 = req.body.qval6;
    var qv7 = req.body.qval7;
    var qv8 = req.body.qval8;
    var qv9 = req.body.qval9;
    var qv10 = req.body.qval10;
    // console.log(qv1,qv2);
    var mark = 0

    mongoClient.connect(url, function (err, db) {

        if (err) throw err;

        var dbo = db.db("question")

        dbo.collection("gs").find({}).toArray(function (err, result) {

            if (err) throw err;
            // console.log(result);
            if (qv1 == (result[0].correct)) {
                mark++;
                console.log("if1");
            }
            if (qv2 == (result[1].correct)) {
                mark++
                console.log("if2");
            }
            if (qv3 == (result[2].correct)) {
                mark++
                console.log("if3");
            }
            if (qv4 == (result[3].correct)) {
                mark++
                console.log("if4");
            }
            if (qv5 == (result[4].correct)) {
                mark++
                console.log("if4");
            }
            if (qv6 == (result[5].correct)) {
                mark++
                console.log("if4");
            }
            if (qv7 == (result[6].correct)) {
                mark++
                console.log("if4");
            }
            if (qv8 == (result[7].correct)) {
                mark++
                console.log("if4");
            }
            if (qv9 == (result[8].correct)) {
                mark++
                console.log("if4");
            }
            if (qv10 == (result[9].correct)) {
                mark++
                console.log("if4");
            }
            
            console.log(mark);
            mongoClient.connect(url, function (err, db) {
                if (err) throw err;
                var user = req.session.email;
                var data = { 'user': user, 'score': mark, 'test':req.params.test }
                var dbo = db.db("score_card");
                var dbscollection = dbo.collection("score")
                dbscollection.insertOne(data, function (err, res) {
                    if (err) throw err;
                    console.log(" record inserted");

                    db.close();
                });
                res.redirect('/home')

                // dbo.collection("score").findOne(use, function (err, result) {
                //     if (err) throw err;
                //     var user=req.body.username;
                //     var data={'user': user, 'score':mark}
                // })
            })


        })
    })

})

app.get('/logeout', function (req, res) {

    req.session.destroy(function (err) {
        if (err) {
            return (err);
        } else {
            return res.redirect('/');
        }
    });
})

app.post('/sub',(req,res)=>{
    var user=req.session.name;
    var email=req.body.email;
    var mobile=req.body.mobile;
    var user_message=req.body.message;
    var date=new Date();
    var data={
        name:user,
        email:email,
        mobile:mobile,
        message:user_message,
        time:date
    }
    mongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("contact");
        
        dbo.collection("feed").insertOne(data, function(err, res) {
          if (err) throw err;
          console.log("1 document inserted");
          db.close();
        });
    });
    res.redirect('/home')
})



var port = 9000;
app.listen(port, () => {
    console.log("app running on " + port)
})