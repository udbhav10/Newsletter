const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");

})

app.post("/failure", function(req, res) {
    res.redirect("/");
})

app.post("/", function(req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
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
    const url = "https://us10.api.mailchimp.com/3.0/lists/41a167f0ea";
    const options = {
        method: "POST",
        auth: "udbhav:7712bdf73000027e0e6f44269ec5e4c9-us10"
    };

    const request = https.request(url, options, function(response) {

        if(response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        }
        else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data) {
            console.log(JSON.parse(data));
        });
    })

    request.write(jsonData);
    request.end();

    // console.log(firstName, lastName, email);
    // res.send("Thank you for signing up!");
})

app.listen(PORT, function(req, res) {
    console.log("Server is up on port ${PORT}");
})

// APIkey
// 7712bdf73000027e0e6f44269ec5e4c9-us10

//AudienceID
// 41a167f0ea
