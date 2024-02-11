const functions = require("firebase-functions");
const postmark = require("postmark");
const fs = require("fs");
const admin = require("firebase-admin");
const moment = require("moment-timezone");
admin.initializeApp();

const client = new postmark
    .ServerClient("bb670cea-e3bb-47e2-b3c3-4abe7290c037");

exports.sendEmailNotification = functions
    .https
    .onCall((data) => {
      const {emailList, timezone} = data;
      if (!Array
          .isArray(emailList) || emailList.length === 0) {
        throw new functions
            .https
            .HttpsError(
                "invalid-argument",
                "Invalid or missing function parameters.");
      }

      let template;
      try {
        template = fs.readFileSync("./email.html", "utf-8");
      } catch (e) {
        console.error("Template Reading Error", e);
        throw new functions
            .https
            .HttpsError("internal", "Failed to read the email template.");
      }

      const currentDate = moment().tz(timezone || "UTC")
          .format("dddd, MMMM Do YYYY, h:mm a");

      const replacements = {
        "{{Date}}": currentDate,
        "{{Url}}": "https://vasco-6851a.web.app/dashboard",
      };


      // eslint-disable-next-line guard-for-in
      for (const key in replacements) {
        template = template.replace(key, replacements[key]);
      }

      return client.sendEmail({
        "From": "delivery@vascoapp.io",
        "To": emailList.join(", "),
        "Subject": "New Material Delivery!",
        "HtmlBody": template,
        "MessageStream": "outbound",
      })
          .then((r) => {
            console.log("Email Sent", r);
            return {success: true};
          })
          .catch((e) => {
            console.error("Detailed Email Error", e);
            throw new functions
                .https
                .HttpsError(
                    "internal",
                    `Failed to send the email. Reason: ${e.message}`);
          });
    });
