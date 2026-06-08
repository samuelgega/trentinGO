//file per testare gli eventi
const Evento = require('../models/Evento')
const request = require('supertest')
const app = require('../app')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

// CREA EVENTO (19-24)
describe('POST /api/v1/eventi', () => {
    beforeAll(async () => {
        jest.setTimeout(10000)
        app.locals.db = await mongoose.connect(process.env.DB_URL)
    })
    afterAll(() => { mongoose.connection.close(true) })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    describe("(19) Creazione di un evento con dati validi", () => {
        test("Status 201. L'evento viene creato con successo e viene restituito un messaggio di successo e l'oggetto creato", async () => {
            const token = jwt.sign(
                { id: 1234, ruolo: 'amministratore' },
                process.env.JWT_SECRET,
                { expiresIn: '1m' }
            )

            const ev = {
                nome: 'Concerto',
                categoria: 'Musica e concerti',
                dataInizio: '2026-07-01',
                dataFine: '2026-07-02',
                latitudine: 46.06,
                longitudine: 11.11
            }
            jest.spyOn(Evento, 'create').mockResolvedValue(ev)

            const risposta = await request(app).post('/api/v1/eventi')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    nome: ev.nome,
                    categoria: ev.categoria,
                    dataInizio: ev.dataInizio,
                    dataFine: ev.dataFine,
                    latitudine: ev.latitudine,
                    longitudine: ev.longitudine
                })
            expect(risposta.statusCode).toBe(201)
            expect(risposta.body.message).toBeDefined()
            expect(risposta.body.data).toBeDefined()
            expect(Evento.create).toHaveBeenCalledTimes(1)
        })
    })

    describe("(20) Creazione di un evento con data di fine antecedente alla data di inizio", () => {
        test("Status 400. La validazione delle date fallisce. Il sistema restituisce l'errore: \"La data di fine deve essere successiva alla data di inizio\"", async () => {
            const token = jwt.sign(
                { id: 1234, ruolo: 'amministratore' },
                process.env.JWT_SECRET,
                { expiresIn: '1m' }
            )

            const ev = {
                nome: 'Concerto',
                dataInizio: '2026-07-10',
                dataFine: '2026-07-05',
                latitudine: 46.06,
                longitudine: 11.11
            }
            jest.spyOn(Evento, 'create').mockResolvedValue(ev)

            const risposta = await request(app).post('/api/v1/eventi')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    nome: ev.nome,
                    dataInizio: ev.dataInizio,
                    dataFine: ev.dataFine,
                    latitudine: ev.latitudine,
                    longitudine: ev.longitudine
                })
            expect(risposta.statusCode).toBe(400)
            expect(risposta.body.error).toBe('La data di fine deve essere successiva alla data di inizio')
        })
    })

    describe("(21) Creazione di un evento con campo obbligatorio 'nome' mancante", () => {
        test("Status 400. La validazione fallisce. Il sistema restituisce l'errore: \"Il nome dell'evento è obbligatorio\"", async () => {
            const token = jwt.sign(
                { id: 1234, ruolo: 'amministratore' },
                process.env.JWT_SECRET,
                { expiresIn: '1m' }
            )

            const ev = {
                nome: '',
                categoria: 'Musica',
                dataInizio: '2026-07-01',
                dataFine: '2026-07-02',
                latitudine: 46.06,
                longitudine: 11.11
            }
            jest.spyOn(Evento, 'create').mockResolvedValue(ev)

            const risposta = await request(app).post('/api/v1/eventi')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    nome: ev.nome,
                    categoria: ev.categoria,
                    dataInizio: ev.dataInizio,
                    dataFine: ev.dataFine,
                    latitudine: ev.latitudine,
                    longitudine: ev.longitudine
                })
            expect(risposta.statusCode).toBe(400)
            expect(risposta.body.error).toBe('Il nome dell\'evento è obbligatorio')
        })
    })

    describe("(22) Creazione di un evento con data di inizio nel passato", () => {
        test("Status 400. Status 400. La validazione temporale fallisce. Il sistema restituisce l'errore: \"La data di inizio non può essere nel passato\"", async () => {
            const token = jwt.sign(
                { id: 1234, ruolo: 'amministratore' },
                process.env.JWT_SECRET,
                { expiresIn: '1m' }
            )

            const ev = {
                nome: 'Sagra',
                dataInizio: '2020-01-01',
                dataFine: '2020-01-02',
                latitudine: 46.06,
                longitudine: 11.11
            }
            jest.spyOn(Evento, 'create').mockResolvedValue(ev)

            const risposta = await request(app).post('/api/v1/eventi')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    nome: ev.nome,
                    dataInizio: ev.dataInizio,
                    dataFine: ev.dataFine,
                    latitudine: ev.latitudine,
                    longitudine: ev.longitudine
                })
            expect(risposta.statusCode).toBe(400)
            expect(risposta.body.error).toBe('La data di inizio non può essere nel passato')
        })
    })

    describe("(23) Creazione di un evento con utente giocatore", () => {
        test("Status 401. Il middleware di protezione delle rotte blocca la richiesta prima del controller. Il sistema restituisce un errore di \"Accesso negato: permessi insufficienti\"", async () => {
            const token = jwt.sign(
                { id: 1234, ruolo: 'giocatore' },
                process.env.JWT_SECRET,
                { expiresIn: '1m' }
            )

            const ev = {
                nome: 'Concerto',
                categoria: 'Musica e concerti',
                dataInizio: '2026-07-01',
                dataFine: '2026-07-02',
                latitudine: 46.06,
                longitudine: 11.11
            }
            jest.spyOn(Evento, 'create').mockResolvedValue(ev)

            const risposta = await request(app).post('/api/v1/eventi')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    nome: ev.nome,
                    categoria: ev.categoria,
                    dataInizio: ev.dataInizio,
                    dataFine: ev.dataFine,
                    latitudine: ev.latitudine,
                    longitudine: ev.longitudine
                })
            expect(risposta.statusCode).toBe(403)
            expect(risposta.body.error).toBe('Accesso negato: permessi insufficienti')
        })
    })

    describe("(24) Tentativo di creazione di un evento senza autenticazione", () => {
        test("Status 401. Il middleware di protezione delle rotte blocca la richiesta prima del controller. Il sistema restituisce un errore di \"Accesso negato: token mancante\"", async () => {
            const ev = {
                nome: 'Concerto',
                categoria: 'Musica e concerti',
                dataInizio: '2026-07-01',
                dataFine: '2026-07-02',
                latitudine: 46.06,
                longitudine: 11.11
            }
            jest.spyOn(Evento, 'create').mockResolvedValue(ev)

            const risposta = await request(app).post('/api/v1/eventi')
                .send({
                    nome: ev.nome,
                    categoria: ev.categoria,
                    dataInizio: ev.dataInizio,
                    dataFine: ev.dataFine,
                    latitudine: ev.latitudine,
                    longitudine: ev.longitudine
                })
            expect(risposta.statusCode).toBe(401)
            expect(risposta.body.error).toBe('Accesso negato: token mancante')
        })
    })
})

