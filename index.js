const express = require("express");

const cors = require("cors");
const process = require("process");
var bodyParser = require("body-parser");
const sessions = require("express-session");
const cookieParser = require("cookie-parser");
const testimonials = require("./testimonials");
const projects = require("./projects");
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  port: 465, // true for 465, false for other ports
  host: "smtp.gmail.com",
  auth: {
    user: process.env.smtpmail,
    pass: process.env.smtpassword,
  },
  secure: true,
});

const app = express();

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// cookie parser middleware
app.use(cookieParser());


app.post("/contact", async (req, res) => {
  const mailData = {
    from: process.env.smtpmail, // sender address
    to: process.env.smtpmail, // list of receivers
    subject: "Portfolio message: " + req.body["subject"],
    text: `from :${req.body["name"]} : ${req.body["email"]} \n ${req.body["message"]}`,
    html: /* html */ `
            <h1 style="color : #3898ec; text-align: center;">${req.body["subject"]}</h1>
            <p style="font-size : 20px; "> 
                ${req.body["message"]} 

                <br/>----------------------------------------------
                <br/><small style="font-size : 12px; ">${req.body["name"]} <br/> ${req.body["email"]}</small>
            </p>

            `,
  };
  transporter.sendMail(mailData, function (err, info) {
    if (err) res.send(err);
    else res.send("OK");
  });
});

app.use("/", express.static("./build"));

const host = "0.0.0.0";
const port = process.env.port || 4000;

app.listen(port, host, () => {
  console.log(`running server at http://${host}:${port}`);
});
