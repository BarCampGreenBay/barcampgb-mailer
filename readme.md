# BarCamp Green Bay Mailer

Send email via command-line to @barcampgb.org email lists.

## Usage
```
npm run send -- <list> [options]

list     List to send to

Options:
   -s, --subject   Email subject
   -b, --body      Email body file in templates
   -f, --force     Send the email
```

## Config

Be sure to set `apiKey` for `bcgbmailer` via any of the methods supported by [rc](https://www.npmjs.com/package/rc).
