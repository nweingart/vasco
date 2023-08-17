const functions = require("firebase-functions");
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(functions.config().sendgrid.key);

exports.randomNumber = functions.https.onRequest((request, response) => {
  const number = Math.round(Math.random() * 100);
  response.send(number.toString());
});

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

  const msg = {
    to: mailingList,
    from: email,
    templateId: "RANDOM",
    dynamic_template_data: {
      receipts: receipts,
      images: images,
      date: date,
      vendor: vendor,
      project: project,
      notes: notes,
      email: email,
      status: status,
    },
  };

  sgMail.send(msg)
      .then(() => {
        console.log("Email sent successfully!");
      })
      .catch((error) => {
        console.error("Error sending email via SendGrid:", error);
        throw new functions.https.HttpsError("unknown", error.message);
      });
});
