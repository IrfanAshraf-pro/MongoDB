const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.MAIL_KEY);
async function sendVerificationEmail(msg) {
  sgMail
    .send(msg)
    .then((response) => {
      console.log(response[0].statusCode);
      console.log(response);
      return response;
    })
    .catch((error) => {
      console.error("this is error",error);
      return error;
    });
}
module.exports = {
  sendVerificationEmail,
};