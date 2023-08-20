const path = require('path');
const express = require('express');
const nodemailer = require('nodemailer');

const app = express();
const port = 3000;

app.use(express.json()); // Parse JSON-encoded request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.use("/public", express.static(__dirname + '/public'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Define the extractEmails function
function extractEmails(text) {
    const regex = /[\w._%+-]+@[\w.-]+\.[a-zA-Z]{2,4}/g;
    const matches = text.match(regex);
    return matches || [];
}

// Serve the index.html file when the user visits the root URL
app.get('/', (req, res) => {
    res.render('index');
});

// Handle the POST request when the user clicks the Send Email button
app.post('/send', (req, res) => {
    let userADR = req.body.emailInput;
    let passwordInput = req.body.passwordInput;
    let listDestination = req.body.listDestination;
    let subjectInput = req.body.subjectInput;
    let htmlContent = req.body.htmlContent;

    htmlContent = '`'+htmlContent+'`';
    let emails = extractEmails(listDestination);
    
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: userADR,
            pass: passwordInput
        }
    });
    let mailOptions = {
        from: userADR, // sender address
        to: emails, // list of receivers
        subject: subjectInput, // Subject line
        html: htmlContent
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send("Error when sending email.");
            return;
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).send("Email sent successfully.");
        }
    });
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});