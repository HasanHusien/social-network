// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs

import { env } from "../../config/env.js";
import { convert } from "html-to-text";
import { createElement } from "react";
import { render } from "@react-email/components";

import Welcome from "./template/Welcome.js";
import ResetPassword from "./template/ResetPassword.js";

import sgMail from "@sendgrid/mail";
sgMail.setApiKey(env.sendgridKey);
// sgMail.setDataResidency('eu');
// uncomment the above line if you are sending mail using a regional EU subuser

// CONVERT TO ONE CLASS Welcome && Reset
async function sendWelcomeEmail(user: any, url: string) {
  try {
    const companyName = "Unknown";
    const firstName = user.name ? user.name.split(" ")[0] : "there";
    const element = await render(createElement(Welcome, { firstName, url }));

    const msg = {
      to: String(user.email),
      from: {
        email: String(env.sendgridEmail),
        name: companyName,
      },
      subject: `Welcome to ${companyName}. ${firstName}`,
      text: convert(element),
      html: element,
    };

    await sgMail.send(msg);
  } catch (err) {
    console.log(err);
  }
}

async function sendResetPasswordEmail(user: any, url: string) {
  try {
    const companyName = "Unknown";
    const firstName = user.name ? user.name.split(" ")[0] : "there";
    const element = await render(
      createElement(ResetPassword, { firstName, url }),
    );

    const msg = {
      to: String(user.email),
      from: {
        email: String(env.sendgridEmail),
        name: companyName,
      },
      subject: "Your password reset token (valid for only 10 minutes)",
      text: convert(element),
      html: element,
    };

    await sgMail.send(msg);
  } catch (err) {
    console.log(err);
  }
}

export { sendWelcomeEmail, sendResetPasswordEmail };
