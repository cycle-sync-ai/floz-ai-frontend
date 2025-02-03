// src/utils/email.js
import { google } from "googleapis";

// Function to send an email
async function sendEmail(auth, emailContent, recipient) {
  const gmail = google.gmail({ version: 'v1', auth });
  const utf8Subject = `=?utf-8?B?${Buffer.from('Meeting Summary and Action Items').toString('base64')}?=`;
  const messageParts = [
    `To: ${recipient}`,
    'Content-Type: text/plain; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${utf8Subject}`,
    '',
    emailContent,
  ];
  const message = messageParts.join('\n');

  // The body needs to be base64url encoded.
  const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

  try {
    let res = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });
    // console.log('Email sent:', res.data);
    return res.data;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}
export default sendEmail;



// const { google } = require("googleapis");
// const gmail = google.gmail("v1");
//
// async function sendEmail(auth, emailContent, recipient) {
//   const rawEmail = Buffer.from(
//     `To: ${recipient}\r\n` +
//       "Subject: Project Details\r\n" +
//       "Content-Type: text/plain; charset=utf-8\r\n" +
//       "MIME-Version: 1.0\r\n" +
//       "\r\n" +
//       emailContent
//   )
//     .toString("base64")
//     .replace(/\+/g, "-")
//     .replace(/\//g, "_");
//
//   return await gmail.users.messages.send({
//     auth,
//     userId: "me",
//     requestBody: {
//       raw: rawEmail,
//     },
//   });
// }
//
// function sendEmail(auth, content, recipient) {
//   // Your logic to send an email using Gmail's API or another service.
//   // Use 'auth' to authenticate, 'content' for the email body, and 'recipient' for the destination.
// }
//
// module.exports = sendEmail;
