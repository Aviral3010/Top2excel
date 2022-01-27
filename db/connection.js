var mongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

var ins = function (depObj) {
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
}
module.exports = ins;