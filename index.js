#!/usr/bin/env node
var fs = require('fs');
var config = require('rc')('bcgbmailer', {
    domain: 'barcampgb.org'
});
if (!config.apiKey) {
    error('No api key specified!');
}
var mailgun = require('mailgun-js')(config);
var opts = require('nomnom')
    .option('list', {
        position: 0,
        help: 'List to send to',
        choices: ['test', 'updates', 2014, 2015],
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
    .option('dryRun', {
        full: 'dry-run',
        abbr: 'd',
        help: 'Output email instead of sending',
        flag: true
    })
    .nocolors()
    .parse();

sendEmail(opts.list, opts.subject, opts.body, opts.dryRun);

function sendEmail (list, subject, body, dryRun) {
    var data = {
        to: list + '@barcampgb.org',
        from: 'BarCamp Green Bay <info@barcampgb.org>',
        subject: subject,
        text: fs.readFileSync(__dirname + '/templates/' + body, 'utf-8')
    };
    console.log(data);
    if (dryRun || !data.body || !data.subject || !list) {
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