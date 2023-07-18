const functions = require("firebase-functions");
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
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


exports.sendEmail = functions.https.onCall((data, context) => {
  // eslint-disable-next-line max-len
  readHTMLFile(__dirname + "/email.html",
    function(err, html) {
      if (err) {
        console.log("error reading file", err);
      } else {
        const template = handlebars.compile(html);
        const replacements = {
          receipt1: data.receipt1,
          receipt2: data.receipt2,
          receipt3: data.receipt3,
          receipt4: data.receipt4,
          receipt5: data.receipt5,
          image1: data.image1,
          image2: data.image2,
          image3: data.image3,
          image4: data.image4,
          image5: data.image5,
          date: data.date,
          vendor: data.vendor,
          project: data.project,
          notes: data.notes,
        };
        const htmlToSend = template(replacements);
        const options = {
          from: "Vasco",
          to: data.email,
          cc: data.email,
          bcc: [data.mailingList],
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
