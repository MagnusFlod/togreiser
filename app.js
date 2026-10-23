// Importerer express-modulen
var express = require('express');

// Henter path modulen fra node
// Inneholder funksjoner for å arbeide med fil og mappestier
var path = require('path');

// Importerer npm-pakken cookieparser
// Cookieparser brukes til å lese og behandle cookies som kommer med http-forespørseler
var cookieParser = require('cookie-parser');

// Henter npm-pakken morgan
// Logger informasjon om http-forespørseler
// F.eks GET /users 200 GET /trains 404 POST /users 201
var logger = require('morgan');

// Importerer tabellstrukturene fra models-filene slik at vi kan lage kobling mellom sequelize og databasen
var db = require('./models');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var populateRouter = require('./routes/populate');

// Kaller funksjonen express() og lagrer det express returnerer i app
// app inneholder da Express-applikasjonen som funksjonen opprettet
var app = express();

// Kobler opp sequelize med databasen
db.sequelize.sync({ force: false })
  .then(() => console.log('Database models synchronized.'))
  .catch(err => console.log('DB error', err));

// Variabelen 'logger' inneholder funksjonen som Morgan-pakken eksporterer
// Kaller funksjonen og sender inn strengen 'dev' som argument
// Morgan bruker argumentet til å velge et loggformat som heter 'dev'
// Formatet bestemmer hvordan informasjon om HTTP-forespørsler skal vises i terminalen
// Eksempel: GET /users 200 12.345 ms - 42
// Logglinjen viser blant annet HTTP-metode, sti, statuskode og behandlingstid
// logger('dev') returnerer en middleware-funksjon som kan produsere slike logglinjer
// app.use() registrerer middleware som Express skal bruke når forespørsler behandles
// Alt i alt brukes denne linjen til å logge HTTP-forespørsler
app.use(logger('dev'));

// Registrerer middleware som kan omforme JSON-data i HTTP-body til JavaScript-data
// Parser JSON-tekst fra HTTP-body, slik at vi kan hente dataene fra req.body
app.use(express.json());

// Klienten kan også sende data, ikke bare i JSON-format, men i application/x-www-form-urlencoded
// F.eks kan klienten sende opplysninger i et format som ser slik ut: destination=Bergen&passengers=2
// express.urlencoded() sørger for at Express kan parse disse dataene
// Dette for at vi kan hente dem fra req.body, omtrent som med express.json().
app.use(express.urlencoded({ extended: false }));

// Middleware-funksjonen fra cookie-parser leser og parser cookie-informasjonen fra HTTP-forespørselen
// Deretter kan rutene våre hente de vanlige cookieverdiene fra req.cookies
app.use(cookieParser());

// Denne linjen gjør det mulig å sende statiske filer til klienten
// F.eks. CSS-filer som bestemmer tekstur og utseende
// HTML-filer og frontend-JavaScript som skal kjøres i nettleseren
// path.join() setter sammen filsystemstien til prosjektmappen (__dirname) med mappenavnet public
// Da kan klienten få tilgang til filer som befinner seg i public-mappen
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/populate', populateRouter);

// Eksporterer den konfigurerte Express-applikasjonen,
// slik at andre filer kan importere og bruke den.
module.exports = app;