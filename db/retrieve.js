var mongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var retrieve = function (use) {
    mongoClient.connect(url, function (err, db) {
        if (err) throw err;

        var dbo = db.db("onlineExam");
        dbo.collection("UserInformation").findOne(use, function (err, result) {
            if (err) throw err;
            console.log('running')
            // console.log(result);
            if (!result) {
                
                return {}

            } else {
               
                return result;
            }
        })
        // db.close();

    })
}

module.exports=retrieve;