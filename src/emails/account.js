const sgMail = require('@sendgrid/mail')

const sendgridAPIKey = process.env.SENDGRID_API_KEY
sgMail.setApiKey(sendgridAPIKey);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'hotinbk@gmail.com',
        subject: 'Thanks for joining in TaskApp',
        text: `Welcome to the app, ${name}. Have a good day`,
    })
}

const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'hotinbk@gmail.com',
        subject: 'You\'ve canceled your account!',
        text: 'Successful!'
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}
