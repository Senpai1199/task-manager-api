const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "divyansh1199@gmail.com",
    subject: "Thanks for joining!",
    text: `Welcome to the app ${name}! Let me know how you get along with the app.`,
  });
};

const sendExitEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "divyansh1199@gmail.com",
    subject: "Sorry to see you go!",
    text: `Thanks for using our app ${name}! Let me know if there is anything we could do to improve the app.`,
  });
};
module.exports = {
  sendWelcomeEmail,
  sendExitEmail,
};
