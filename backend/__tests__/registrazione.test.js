const request = require('supertest')
const app = require('../app')
const Giocatore = require('../models/Giocatore')
const Gestore = require('../models/Gestore')
const dbTest = require('./config/dbTest')

// Gestione del db
beforeAll(async () => await dbTest.connect())
afterAll(async () => await dbTest.closeDatabase())
afterEach(async () => await dbTest.clearDatabase())

describe('=== TEST PER LA REGISTRAZIONE ===', () => {

    // registrazione giocatore
    describe('• POST /api/v1/giocatori/registrazione', () => {

        describe("(1) Registrazione con dati validi", () => {
            test("Status 201. Il giocatore viene creato con successo e l'oggetto creato viene restituito nella risposta.", async () => {
                const nuovoGiocatore = {
                    username: 'mario99',
                    email: 'mario@example.com',
                    password: 'Password1'
                }

                const risposta = await request(app)
                    .post('/api/v1/giocatori')
                    .send(nuovoGiocatore)

                expect(risposta.statusCode).toBe(201)
                expect(risposta.body).toHaveProperty('message', 'Giocatore registrato con successo')
                expect(risposta.body.data).toHaveProperty('username', 'mario99')
                expect(risposta.body.data).toHaveProperty('email', 'mario@example.com')
            })
        })

        describe("(2) Registrazione con campo obbligatorio mancante", () => {
            test("Status 400. La validazione fallisce. Il sistema restituisce l'errore: \"username, email e password sono obbligatori\"", async () => {
                const risposta = await request(app)
                    .post('/api/v1/giocatori')
                    .send({ email: 'mario@example.com', password: 'Password1' })

                expect(risposta.statusCode).toBe(400)
                expect(risposta.body).toHaveProperty('error', 'username, email e password sono obbligatori')
            })
        })

        describe("(3) Registrazione con password inferiore a 8 caratteri", () => {
            test("Status 400. La validazione fallisce. Il sistema restituisce l'errore: \"La password deve essere di almeno 8 caratteri\"", async () => {
                const risposta = await request(app)
                    .post('/api/v1/giocatori')
                    .send({ username: 'mario99', email: 'mario@example.com', password: '123' })

                expect(risposta.statusCode).toBe(400)
                expect(risposta.body).toHaveProperty('error', 'La password deve essere di almeno 8 caratteri')
            })
        })

        describe("(4) Registrazione con formato email non valido", () => {
            test("Status 400. La validazione fallisce. Il sistema restituisce l'errore: \"Inserisci un'email valida\"", async () => {
                const risposta = await request(app)
                    .post('/api/v1/giocatori')
                    .send({ username: 'mario99', email: 'emailnonvalida', password: 'Password1' })

                expect(risposta.statusCode).toBe(400)
                expect(risposta.body).toHaveProperty('error', "Inserisci un'email valida")
            })
        })

        describe("(5) Registrazione con username già esistente", () => {
            test("Status 409. La creazione fallisce. Il sistema restituisce l'errore: \"Username gia esistente\"", async () => {
                await Giocatore.create({
                    username: 'mario99',
                    email: 'altro@example.com',
                    password: 'Password1'
                })

                const risposta = await request(app)
                    .post('/api/v1/giocatori')
                    .send({ username: 'mario99', email: 'mario@example.com', password: 'Password1' })

                expect(risposta.statusCode).toBe(409)
                expect(risposta.body).toHaveProperty('error', 'Username gia esistente')
            })
        })

        describe("(6) Registrazione con email già esistente", () => {
            test("Status 409. La creazione fallisce. Il sistema restituisce l'errore: \"Email gia esistente\"", async () => {
                await Giocatore.create({
                    username: 'altrouser',
                    email: 'mario@example.com',
                    password: 'Password1'
                })

                const risposta = await request(app)
                    .post('/api/v1/giocatori')
                    .send({ username: 'mario99', email: 'mario@example.com', password: 'Password1' })

                expect(risposta.statusCode).toBe(409)
                expect(risposta.body).toHaveProperty('error', 'Email gia esistente')
            })
        })
    })

    // registrazione gestore
    describe('• POST /api/v1/gestori/registrazione', () => {

        describe("(7) Registrazione con dati validi", () => {
            test("Status 201. Il gestore viene creato con successo e l'oggetto creato viene restituito nella risposta.", async () => {
                const nuovoGestore = {
                    nome: 'MART Rovereto',
                    email: 'mart@example.com',
                    password: 'Password1',
                    partitaIva: '12345678901'
                }

                const risposta = await request(app)
                    .post('/api/v1/gestori')
                    .send(nuovoGestore)

                expect(risposta.statusCode).toBe(201)
                expect(risposta.body).toHaveProperty('message', 'Gestore registrato con successo')
                expect(risposta.body.data).toHaveProperty('nome', 'MART Rovereto')
                expect(risposta.body.data).toHaveProperty('email', 'mart@example.com')
            })
        })

        describe("(8) Registrazione con campo obbligatorio mancante", () => {
            test("Status 400. La validazione fallisce. Il sistema restituisce l'errore: \"nome, email, password e partitaIva sono obbligatori\"", async () => {
                const risposta = await request(app)
                    .post('/api/v1/gestori')
                    .send({ nome: 'MART Rovereto', email: 'mart@example.com', password: 'Password1' })

                expect(risposta.statusCode).toBe(400)
                expect(risposta.body).toHaveProperty('error', 'nome, email, password e partitaIva sono obbligatori')
            })
        })

        describe("(9) Registrazione con password inferiore a 8 caratteri", () => {
            test("Status 400. La validazione fallisce. Il sistema restituisce l'errore: \"La password deve essere di almeno 8 caratteri\"", async () => {
                const risposta = await request(app)
                    .post('/api/v1/gestori')
                    .send({ nome: 'MART Rovereto', email: 'mart@example.com', password: '123', partitaIva: '12345678901' })

                expect(risposta.statusCode).toBe(400)
                expect(risposta.body).toHaveProperty('error', 'La password deve essere di almeno 8 caratteri')
            })
        })

        describe("(10) Registrazione con nome già esistente", () => {
            test("Status 409. La creazione fallisce. Il sistema restituisce l'errore: \"Nome o email già in uso\"", async () => {
                await Gestore.create({
                    nome: 'MART Rovereto',
                    email: 'altro@example.com',
                    password: 'Password1',
                    partitaIva: 11111111111
                })

                const risposta = await request(app)
                    .post('/api/v1/gestori')
                    .send({ nome: 'MART Rovereto', email: 'mart@example.com', password: 'Password1', partitaIva: '12345678901' })

                expect(risposta.statusCode).toBe(409)
                expect(risposta.body).toHaveProperty('error', 'Nome o email già in uso')
            })
        })

        describe("(11) Registrazione con email già esistente", () => {
            test("Status 409. La creazione fallisce. Il sistema restituisce l'errore: \"Nome o email già in uso\"", async () => {
                await Gestore.create({
                    nome: 'Altro Nome',
                    email: 'mart@example.com',
                    password: 'Password1',
                    partitaIva: 11111111111
                })

                const risposta = await request(app)
                    .post('/api/v1/gestori')
                    .send({ nome: 'MART Rovereto', email: 'mart@example.com', password: 'Password1', partitaIva: '12345678901' })

                expect(risposta.statusCode).toBe(409)
                expect(risposta.body).toHaveProperty('error', 'Nome o email già in uso')
            })
        })

        describe("(12) Registrazione con partita IVA già esistente", () => {
            test("Status 409. La creazione fallisce. Il sistema restituisce l'errore: \"Partita IVA già esistente\"", async () => {
                await Gestore.create({
                    nome: 'Altro Nome',
                    email: 'altro@example.com',
                    password: 'Password1',
                    partitaIva: 12345678901
                })

                const risposta = await request(app)
                    .post('/api/v1/gestori')
                    .send({ nome: 'MART Rovereto', email: 'mart@example.com', password: 'Password1', partitaIva: '12345678901' })

                expect(risposta.statusCode).toBe(409)
                expect(risposta.body).toHaveProperty('error', 'Partita IVA già esistente')
            })
        })
    })
})
