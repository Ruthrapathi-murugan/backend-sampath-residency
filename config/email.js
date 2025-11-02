const SibApiV3Sdk = require('@sendinblue/client');

const client = new SibApiV3Sdk.TransactionalEmailsApi();
client.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

const sendEmail = async (mailOptions) => {
  try {
    await client.sendTransacEmail({
      sender: { email: 'yourname@gmail.com', name: 'Sampath Residency' },
      to: [{ email: mailOptions.to }],
      subject: mailOptions.subject,
      htmlContent: mailOptions.html,
    });
    console.log('✅ Email sent successfully via Brevo');
    return true;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
};

module.exports = sendEmail;
