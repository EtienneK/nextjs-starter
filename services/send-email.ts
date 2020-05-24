import sendgrid from 'sendgrid';

export default async function sendEmail(
  to: string, subject: string, content: { type: string; value: string },
): Promise<void> {
  const helper = sendgrid.mail;
  const fromEmail = new helper.Email(process.env.NEXT_PUBLIC_EMAIL_FROM);
  const toEmail = new helper.Email(to);
  const mail = new helper.Mail(fromEmail, subject, toEmail, content);

  const sg = sendgrid(process.env.SENDGRID_API_KEY);
  const request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON(),
  });
  return sg.API(request).then(() => { }).catch(err => {
    console.error(err);
    if (err?.response?.body) {
      console.error(err.response.body.errors);
    }
  });
}
