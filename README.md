<p align="center">
  <a href="http://github.com/apozinn/halk" target="blank"><img src="https://imgur.com/viedp2m.png" width="150" alt="halk logo" /></a>
</p>

<p align="center">This is an open source real-time messaging app project in react-native</p>

## Description
This application was created with the intention of helping new developers and expanding our knowledge. This app is fully open source and collaborative, we try to bring all the necessary features to an app of this type.

<p align="center">
  <a href="http://github.com/apozinn/halk" target="blank"><img src="https://i.imgur.com/38cNdka.png" width="120" alt="halk preview" /></a>
  <a href="http://github.com/apozinn/halk" target="blank"><img src="https://i.imgur.com/38cNdka.png" width="120" alt="halk preview" /></a>
  <a href="http://github.com/apozinn/halk" target="blank"><img src="https://i.imgur.com/38cNdka.png" width="120" alt="halk preview" /></a>
  <a href="http://github.com/apozinn/halk" target="blank"><img src="https://i.imgur.com/38cNdka.png" width="120" alt="halk preview" /></a>
  <a href="http://github.com/apozinn/halk" target="blank"><img src="https://i.imgur.com/38cNdka.png" width="120" alt="halk preview" /></a>
</p>

## where to use
If you want to test the main version of the app, download the latest version in [releases](http://github.com/apozinn/halk/releases). I hope to host the app in stores as soon as possible, but until then you can also test it locally by following the steps below

## Installation
```bash
$ npm install
$ npm start
```
<p>Do it on client and server.</p>

## about the server
The main application, hosted at the expo and stores, runs on the main server, as a data security measure, only requests made by the main application will be accepted, if you plan to use it for development, host the server locally, and update the keys of access (present in envs)

## Environment variables
```bash
# client
API_ENDPOINT #server endpoint
API_SECRET_PHRASE #server access key (must be same on client and server)
API_KEY #encryption key for server access key (must be same on client and server)
AMPLIFY_USER_EMAIL #amplify user email
AMPLIFY_USER_PASSWORD #amplify user password

# server
DATABASE_URL #mongoDB cluster link
TWILIO_ACCOUNT_SID #(create a twilio account and get these tokens)
TWILIO_AUTH_TOKEN #(create a twilio account and get these tokens)
TWILIO_PHONE #(create a twilio account and get these tokens)
API_SECRET_PHRASE #server access key (must be same on client and server)
API_KEY #encryption key for server access key (must be same on client and server)
```

## Running the app
```bash
# client
$ npm start or npm run android / ios

# server
$ npm run start:dev
```

## Support
The project may have errors, if there are problems with something, report it, and if you can, send improvement ideas