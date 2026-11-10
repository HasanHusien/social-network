// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs

import { env } from "../../config/env.js";
import { convert } from "html-to-text";
import { createElement, type ReactNode } from "react";
import { render } from "@react-email/components";

import Welcome from "./template/Welcome.js";
import ResetPassword from "./template/ResetPassword.js";

import sgMail from "@sendgrid/mail";
sgMail.setApiKey(env.sendgridKey);
// sgMail.setDataResidency('eu');
// uncomment the above line if you are sending mail using a regional EU subuser

class SendEmail {
  user: string;
  url: string;
  to: string;
  firstName: string;

  constructor(user: any, url: string) {
    this.user = user;
    this.url = url;
    this.to = user.email;
    this.firstName = user.name.split(" ")[0] || "there";
  }

  async send(template: any, subject: string) {
    const html = await render(
      createElement(template, { firstName: this.firstName, url: this.url }),
    );
    const msg = {
      from: {
        email: env.sendgridEmail,
        name: "Unknown",
      },
      to: this.to,
      subject,
      html,
      text: convert(html),
    };

    await sgMail.send(msg);
  }

  async sendWelcome() {
    await this.send(Welcome, "Welcome to our family.");
  }

  async sendPasswordReset() {
    await this.send(
      ResetPassword,
      "Your password reset token (valid for only 10 minutes)",
    );
  }
}

export { SendEmail };
