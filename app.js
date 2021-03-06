const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
 
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res,) {
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;

  
  const data = {
      members: [
          {
              email_address: email,
              status: "subscribed",
              merge_fields: {
                  FNAME: firstName,
                  LNAME: lastName
              }
          }
      ]
  };

  const jsonData = JSON.stringify(data);
  
  const url = "https://us2.api.mailchimp.com/3.0/lists/66fbf1662e";

  const options = {
    method: "POST",
    auth: "kieran:2d1aa21f55e1936c4d0ad65369e86dd3-us2"
  };


  const request = https.request(url, options, function(response) {

   if (response.statusCode === 200) {
       res.sendFile(__dirname + ("/success.html"));
   }else {
       res.sendFile(__dirname + ("/failure.html"));
   }

      response.on("data", function(data) {
          console.log(JSON.parse(data));
    })
  })

  request.write(jsonData);
  request.end();

});

app.post("/failure", function(req, res) {
    res.redirect("/");
})


app.listen(process.env.PORT || 3000, function() {
    console.log("Server started on port 3000");
});



// API key
//2d1aa21f55e1936c4d0ad65369e86dd3-us2
// List id
// 66fbf1662e

// curl --request GET \
// --url 'https://<dc>.api.mailchimp.com/3.0/' \
// --user 'anystring:<YOUR_API_KEY>'