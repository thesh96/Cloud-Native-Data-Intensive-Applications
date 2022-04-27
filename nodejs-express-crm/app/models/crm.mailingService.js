

var AWS = require('aws-sdk');

AWS.config.update({region: 'us-east-1'});

const sendEmail = (recipientEmail, recipientName) => {
    console.log("Inside mailer");
    var params = {
        Destination: {
            ToAddresses: [
                recipientEmail,

            ]
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: 'Dear ' + recipientName + ',\nWelcome to the Book store created by ' + recipientEmail + '.\nExceptionally this time we won’t ask you to click a link to activate your account. \n'
                },
            },
            Subject: {
                Charset: 'UTF-8',
                Data: 'Activate your book store account'
            }
        },
        Source: 'amithesr@andrew.cmu.edu',
        ReplyToAddresses: [
            'amithesr@andrew.cmu.edu',

        ],
    };
    console.log("sending promise");

    var sendPromise = new AWS.SES().sendEmail(params).promise();


    sendPromise.then(
        function (data) {
            console.log(data.MessageId);
        }).catch(
        function (err) {
            console.error(err, err.stack);
        });
}

module.exports = { sendEmail};
