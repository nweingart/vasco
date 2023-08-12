const functions = require("firebase-functions");
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");

exports.randomNumber = functions.https.onRequest((request, response) => {
  const number = Math.round(Math.random() * 100);
  response.send(number.toString());
});


const fs = require("fs");

const transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: "monthlydump@hotmail.com",
    pass: "Shaker12!",
  },
});

const readHTMLFile = function(path, callback) {
  fs.readFile(path, {encoding: "utf-8"}, function(err, html) {
    if (err) {
      callback(err);
    } else {
      callback(null, html);
    }
  });
};


exports.sendEmail = functions.https.onCall((data) => {
  const {
    receipts,
    images,
    date,
    vendor,
    project,
    notes,
    email,
    mailingList,
    status,
  } = data;
  // eslint-disable-next-line max-len
  readHTMLFile(__dirname + "/email.html",
      function(err, html) {
        if (err) {
          console.log("error reading file", err);
        } else {
          const template = handlebars.compile(html);
          const replacements = {
            receipts: receipts,
            images: images,
            date: date,
            vendor: vendor,
            project: project,
            notes: notes,
            email: email,
            status: status,
          };
          const htmlToSend = template(replacements);
          const options = {
            from: "Vasco",
            to: email,
            cc: email,
            bcc: [mailingList],
            subject: `New Delivery from ${data.vendor}!`,
            html: htmlToSend,
          };
          transporter.sendMail(options, (err, info) => {
            if (err) {
              console.log(err);
            } else {
              console.log("Sent" + info.response);
            }
          });
        }
      });
});
