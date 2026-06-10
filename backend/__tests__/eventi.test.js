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
    afterAll(async () => { await mongoose.connection.close() })

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
        test("Status 400. La validazione fallisce. Il sistema restituisce l'errore: \"Dati mancanti\"", async () => {
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
            expect(risposta.body.error).toBe('Dati mancanti')
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

//MODIFICA EVENTO (25-29)
describe('PUT /api/v1/eventi', () => {
    beforeAll(async () => {
        jest.setTimeout(10000)
        app.locals.db = await mongoose.connect(process.env.DB_URL)
    })
    afterAll(async () => { await mongoose.connection.close(true) })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    describe("(25) Aggiornamento del nome di un evento esistente", () => {
        test("Status 200. Il nome dell'evento viene aggiornato l'oggetto modificato viene restituito nella risposta", async () => {
            const token = jwt.sign(
                { id: 1234, ruolo: 'amministratore' },
                process.env.JWT_SECRET,
                { expiresIn: '1m' }
            )
            jest.spyOn(Evento.prototype, 'save').mockResolvedValue({ nome: "Conceto, piazza fiera" })

            const risposta = await request(app).put('/api/v1/eventi/6a0a288b003936e6360e3320') //questo id è vero
                .set('Authorization', `Bearer ${token}`)
                .send({
                    nome: "Conceto, piazza fiera"
                })
            expect(risposta.statusCode).toBe(200)
            expect(risposta.body.message).toBeDefined()
            expect(risposta.body.data).toBeDefined()
            expect(Evento.prototype.save).toHaveBeenCalledTimes(1)
        })
    })

    describe("(26) Modifica di un evento da parte di un gestore che non lo ha creato", () => {
        test("Status 403. L'evento non viene modificato ed il sistema risponde \"Non sei autorizzato a modificare questo evento.\"", async () => {
            const token = jwt.sign(
                { id: '6a10df6f4c977f13fef2dd50', ruolo: 'gestore' },
                process.env.JWT_SECRET,
                { expiresIn: '1m' }
            )
            jest.spyOn(Evento.prototype, 'save').mockResolvedValue({ nome: "Conceto, piazza fiera" })

            const risposta = await request(app).put('/api/v1/eventi/6a0a288b003936e6360e3320') //questo id è vero
                .set('Authorization', `Bearer ${token}`)
                .send({
                    nome: "Conceto, piazza fiera"
                })
            expect(risposta.statusCode).toBe(403)
            expect(risposta.body.error).toBe("Accesso negato: permessi insufficienti")
        })
    })

    describe("(27) Tentativo di modifica della data di fine portandola prima della data di inizio", () => {
        test("Status 400. La validazione logica fallisce. Il sistema intercetta l'incongruenza temporale e restituisce l'errore: \"La data di fine deve essere successiva alla data di inizio\"", async () => {
            const token = jwt.sign(
                { id: 1234, ruolo: 'amministratore' },
                process.env.JWT_SECRET,
                { expiresIn: '1m' }
            )
            jest.spyOn(Evento.prototype, 'save').mockResolvedValue({
                nome: "Concerto",
                dataInizio: "2026-07-10",
                dataFine: "2026-08-01",
                latitudine: 46.06,
                longitudine: 11.11
            })

            const risposta = await request(app).put('/api/v1/eventi/6a0a288b003936e6360e3320') //questo id è vero
                .set('Authorization', `Bearer ${token}`)
                .send({
                    nome: "Concerto",
                    dataInizio: "2026-07-10",
                    dataFine: "2026-07-09",
                    latitudine: 46.06,
                    longitudine: 11.11
                })
            expect(risposta.statusCode).toBe(400)
            expect(risposta.body.error).toBe("La data di fine deve essere successiva alla data di inizio")
        })
    })

    describe("(28) Tentativo di modifica di un evento con ID non esistente", () => {
        test("Status 404. La richiesta fallisce. Il database non trova riscontri e il sistema risponde con l'errore: \"Evento non trovato\"", async () => {
            const token = jwt.sign(
                { id: 1234, ruolo: 'amministratore' },
                process.env.JWT_SECRET,
                { expiresIn: '1m' }
            )
            jest.spyOn(Evento.prototype, 'save').mockResolvedValue({ nome: "Conceto" })

            const risposta = await request(app).put('/api/v1/eventi/6a0a288b003936e6360e3321') //id a caso
                .set('Authorization', `Bearer ${token}`)
                .send({
                    nome: "Concerto",
                })
            expect(risposta.statusCode).toBe(404)
            expect(risposta.body.error).toBe("Evento non trovato")
        })
    })

    describe("(29) Tentativo di modifica di un evento senza autenticazione", () => {
        test("Status 401. Il middleware di protezione delle rotte intercetta la richiesta e restituisce l'errore: 'Accesso negato: token mancante'", async () => {
            jest.spyOn(Evento.prototype, 'save').mockResolvedValue({ nome: "Conceto, piazza fiera" })

            const risposta = await request(app).put('/api/v1/eventi/6a0a288b003936e6360e3320') //id vero
                .send({
                    nome: "Concerto",
                })
            expect(risposta.statusCode).toBe(401)
            expect(risposta.body.error).toBe("Accesso negato: token mancante")
        })
    })
})


//ELIMINA EVENTO (30-33)
describe('DELETE /api/v1/eventi', () => {
    beforeAll(async () => {
        jest.setTimeout(1000000)
        app.locals.db = await mongoose.connect(process.env.DB_URL)
    })
    afterAll(async () => { await mongoose.connection.close() })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    describe("(30) Eliminazione di un evento da parte di un amministratore", () => {
        test("Status 200. L'evento viene eliminato dal database e il server restituisce un messaggio di conferma.", async () => {
            const token = jwt.sign(
                { id: 1234, ruolo: 'amministratore' },
                process.env.JWT_SECRET,
                { expiresIn: '1m' }
            )

            const mockEventoEsistente = {
                _id: '6a0a288b003936e6360e3320',
                properties: {
                    idGestore: '9999', // Indifferente in questo test, l'utente è admin
                },
                deleteOne: jest.fn().mockResolvedValue({})
            }
            jest.spyOn(Evento, 'findById').mockResolvedValue(mockEventoEsistente)

            const risposta = await request(app)
                .delete('/api/v1/eventi/6a0a288b003936e6360e3320')
                .set('Authorization', `Bearer ${token}`)

            expect(risposta.status).toBe(200)
            expect(risposta.body.message).toBe("Evento eliminato con successo")
            expect(mockEventoEsistente.deleteOne).toHaveBeenCalledTimes(1)
        })
    })

    describe("(31) Eliminazione di un evento da parte del gestore che lo ha creato", () => {
        test("Status 200. L'evento viene eliminato dal database e il server restituisce un messaggio di conferma.", async () => {
            const token = jwt.sign(
                { id: '6a155c29e915de589c6a0d87', ruolo: 'gestore' }, //il suo vero gestore
                process.env.JWT_SECRET,
                { expiresIn: '1m' }
            )

            const mockEventoEsistente = {
                _id: '6a0a288b003936e6360e3320',
                properties: {
                    idGestore: '6a155c29e915de589c6a0d87',
                },
                deleteOne: jest.fn().mockResolvedValue({})
            }
            jest.spyOn(Evento, 'findById').mockResolvedValue(mockEventoEsistente)

            const risposta = await request(app).delete('/api/v1/eventi/6a0a288b003936e6360e3320') //questo id è vero
                .set('Authorization', `Bearer ${token}`)
            expect(risposta.status).toBe(200)
            expect(risposta.body.message).toBe("Evento eliminato con successo")
            expect(mockEventoEsistente.deleteOne).toHaveBeenCalledTimes(1)
        })
    })

    describe("(32) Eliminazione di un evento da parte di un gestore che NON lo ha creato", () => {
        test("Status 403. L'evento non viene modificato ed il sistema risponde \"Non sei autorizzato a eliminare questo evento.\"", async () => {
            const token = jwt.sign(
                { id: '6a10df6f4c977f13fef2dd50', ruolo: 'gestore' }, //NON il suo gestore
                process.env.JWT_SECRET,
                { expiresIn: '1m' }
            )

            const mockEventoEsistente = {
                _id: '6a0a288b003936e6360e3320',
                properties: {
                    idGestore: '6a155c29e915de589c6a0d87',
                },
                deleteOne: jest.fn().mockResolvedValue({})
            }
            jest.spyOn(Evento, 'findById').mockResolvedValue(mockEventoEsistente)

            const risposta = await request(app).delete('/api/v1/eventi/6a0a288b003936e6360e3320') //questo id è vero
                .set('Authorization', `Bearer ${token}`)
            expect(risposta.statusCode).toBe(403)
            expect(risposta.body.error).toBe("Accesso negato: permessi insufficienti")
        })
    })

    describe("(33) Tentativo di eliminazione di un evento senza autenticazione", () => {
        test("Status 401. Il middleware di protezione delle rotte intercetta la richiesta e restituisce l'errore: 'Accesso negato: token mancante'", async () => {
            const mockEventoEsistente = {
                _id: '6a0a288b003936e6360e3320',
                properties: {
                    idGestore: '6a155c29e915de589c6a0d87',
                },
                deleteOne: jest.fn().mockResolvedValue({})
            }
            jest.spyOn(Evento, 'findById').mockResolvedValue(mockEventoEsistente)

            const risposta = await request(app).delete('/api/v1/eventi/6a0a288b003936e6360e3320') //questo id è vero
            expect(risposta.statusCode).toBe(401)
            expect(risposta.body.error).toBe("Accesso negato: token mancante")
        })
    })
})