import { resolve } from 'path'
import * as nodemailer from "nodemailer";
import * as hbs from "nodemailer-express-handlebars"

const { host, port, user, pass } = require("../config/mail.json");

const transport = nodemailer.createTransport({
  host,
  port,
  auth: {
    user,
    pass
  }
});

transport.use('compile', hbs({
  viewEngine: {
    defaultLayout: undefined,
    partialsDir: resolve('./src/resources/mail/')
  },
  viewPath: resolve('./src/resources/mail/'),
  extName: '.html',
}));

export = transport;