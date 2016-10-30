#!/usr/bin/env node
var fs = require('fs');
var domain = 'mg.barcampgb.org'
var config = require('rc')('bcgbmailer', {
    domain: domain
});
if (!config.apiKey) {
    error('No api key specified!');
}
var mailgun = require('mailgun-js')(config);
var opts = require('nomnom')
    .option('list', {
        position: 0,
        help: 'List to send to',
        choices: ['test', 'updates', 2016],
        required: true
    })
    .option('subject', {
        abbr: 's',
        help: 'Email subject',
        required: true
    })
    .option('body', {
        abbr: 'b',
        help: 'Email body file in templates',
        required: true
    })
    .option('force', {
        abbr: 'f',
        help: 'Send the email',
        flag: true
    })
    .nocolors()
    .parse();

sendEmail(opts.list, opts.subject, opts.body, !opts.force);

function sendEmail (list, subject, body, dryRun) {
    var data = {
        to: list + '@' + domain,
        from: 'BarCamp Green Bay <info@' + domain + '>',
        subject: subject,
        text: fs.readFileSync(__dirname + '/templates/' + body, 'utf-8')
    };
    console.log(data);
    if (!data.text) {
        error('No email body!');
    }
    if (dryRun) {
        return;
    }
    mailgun.messages().send(data, function(err, res) {
        if (err) {
            error(err);
        }

        console.log(res);
    });
}

function error (message) {
    console.error('error: ' + message);
    process.exit(1);
}
