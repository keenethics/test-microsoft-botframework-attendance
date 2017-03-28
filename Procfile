web: node app.js

function(session ,results , next){
  if(results.response) {
    var epicshit = results.response;
  }
  console.log("SHHHIT",epicshit);
  if (epicshit == "yes"){
      var shit = session.dialogData.profile;
      MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        insertDocument(db, function() {
          db.close();
        },shit);
      });
    session.endDialogWithResult({ response: shit});
  }
  if(epicshit == "no"){
    session.send('So , forgoffffll u write above :)');
    session.beginDialog('/ensureProfile'); 
    }
  
}
