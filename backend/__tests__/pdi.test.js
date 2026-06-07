const request = require('supertest');
const app = require('../app');
const PDI = require('../models/PDI');
const dbTest = require('./config/dbTest');
const jwt = require('jsonwebtoken');

// Gestione del db
beforeAll(async () => await dbTest.connect());
afterAll(async () => await dbTest.closeDatabase());
afterEach(async () => await dbTest.clearDatabase());


describe('=== TEST PER I PUNTI DI INTERESSE (PDI) ===', () => {

    //crea evento
    describe('POST /api/v1/pdi', () => {

        describe("(0) Creazione di un nuovo PDI con dati validi", () => {
            test("Status 201. Il PDI viene creato con successo, salvato nel database e l'oggetto creato viene restituito nella risposta.", async () => {

                //genera token amministratore
                const token = jwt.sign(
                    { id: 1234, ruolo: 'amministratore' },
                    process.env.JWT_SECRET,
                    { expiresIn: '1m' }
                )

                const nuovoPDI = {
                    nome: "Muse",
                    categoria: "Museo",
                    punteggio: 20,
                    latitudine: 46.06,
                    longitudine: 11.11
                };

                //invio richiesta
                const risposta = await request(app)
                    .post('/api/v1/pdi')
                    .set('Authorization', `Bearer ${token}`)
                    .send(nuovoPDI);

                //controllo risposta
                expect(risposta.statusCode).toBe(201);
                expect(risposta.body).toHaveProperty('message', 'PDI creato con successo');
                expect(risposta.body).toHaveProperty('data');
            })
        });

        describe("(1) Creazione di un PDI con campo obbligatorio 'Nome' mancante", () => {
            test("Status 400. La creazione fallisce. Il sistema restituisce l'errore: Il nome del PDI è obbligatorio.", async () => {

                //genera token amministratore
                const token = jwt.sign(
                    { id: 1234, ruolo: 'amministratore' },
                    process.env.JWT_SECRET,
                    { expiresIn: '1m' }
                )

                const nuovoPDI = {
                    nome: "",
                    categoria: "Museo",
                    punteggio: 20,
                    latitudine: 46.06,
                    longitudine: 11.11
                };

                //invio richiesta
                const risposta = await request(app)
                    .post('/api/v1/pdi')
                    .set('Authorization', `Bearer ${token}`)
                    .send(nuovoPDI);

                //controllo risposta
                expect(risposta.statusCode).toBe(400);
                expect(risposta.body).toHaveProperty('error', 'Il nome è un campo obbligatorio');
            })
        })

        describe("(2) Creazione di un PDI con latitudine o longitudine fuori range", () => {
            test("Status 400. La creazione fallisce. Il sistema restituisce l'errore: Inserisci una latitudine/longitudine valida (-90 a 90 / -180 a 180).", async () => {

                //genera token amministratore
                const token = jwt.sign(
                    { id: 1234, ruolo: 'amministratore' },
                    process.env.JWT_SECRET,
                    { expiresIn: '1m' }
                )

                const nuovoPDI = {
                    nome: "Muse",
                    categoria: "Museo",
                    punteggio: 20,
                    latitudine: 300.12,
                    longitudine: 210.11
                };

                //invio richiesta
                const risposta = await request(app)
                    .post('/api/v1/pdi')
                    .set('Authorization', `Bearer ${token}`)
                    .send(nuovoPDI);

                //controllo risposta
                expect(risposta.statusCode).toBe(400);
                expect(risposta.body).toHaveProperty('error', 'le coordinate devono stare nel range latitudine(-90,90), longitudine(-180,180)');
            })
        })

        describe("(3) Creazione di un PDI con il campo obbligatorio 'punteggio' inferiore a 20", () => {
            test("Status 400. La creazione fallisce. Il sistema restituisce l'errore: Il punteggio minimo è di 10 punti.", async () => {

                //genera token amministratore
                const token = jwt.sign(
                    { id: 1234, ruolo: 'amministratore' },
                    process.env.JWT_SECRET,
                    { expiresIn: '1m' }
                )

                const nuovoPDI = {
                    nome: "Muse",
                    categoria: "Museo",
                    punteggio: 5,
                    latitudine: 46.04,
                    longitudine: 11.11
                };

                //invio richiesta
                const risposta = await request(app)
                    .post('/api/v1/pdi')
                    .set('Authorization', `Bearer ${token}`)
                    .send(nuovoPDI);

                //controllo risposta
                expect(risposta.statusCode).toBe(400);
                expect(risposta.body).toHaveProperty('error', 'Il punteggio deve essere almeno di 20');
            })
        })

        describe("(4) Creazione di un PDI con il campo 'descrizione' con più di 500 caratteri", () => {
            test("Status 400. La creazione fallisce. Il sistema restituisce l'errore: La descrizione deve avere al massimo 500 caratteri.", async () => {

                //genera token amministratore
                const token = jwt.sign(
                    { id: 1234, ruolo: 'amministratore' },
                    process.env.JWT_SECRET,
                    { expiresIn: '1m' }
                )

                const descrizioneLunga = 'a'.repeat(550)

                const nuovoPDI = {
                    nome: "Muse",
                    categoria: "Museo",
                    punteggio: 20,
                    latitudine: 46.12,
                    longitudine: 11.11,
                    descrizione: descrizioneLunga
                };

                //invio richiesta
                const risposta = await request(app)
                    .post('/api/v1/pdi')
                    .set('Authorization', `Bearer ${token}`)
                    .send(nuovoPDI);

                //controllo risposta
                expect(risposta.statusCode).toBe(400);
                expect(risposta.body).toHaveProperty('error', 'La descrizione non può superare i 500 caratteri');
            })
        })

        describe("(5) Creazione di un PDI con il campo obbligatorio 'categoria' mancante", () => {
            test("Status 400. La creazione fallisce. Il sistema restituisce l'errore: Seleziona una tipologia.", async () => {

                //genera token amministratore
                const token = jwt.sign(
                    { id: 1234, ruolo: 'amministratore' },
                    process.env.JWT_SECRET,
                    { expiresIn: '1m' }
                )

                const nuovoPDI = {
                    nome: "Muse",
                    categoria: "",
                    punteggio: 20,
                    latitudine: 46.12,
                    longitudine: 11.11
                };

                //invio richiesta
                const risposta = await request(app)
                    .post('/api/v1/pdi')
                    .set('Authorization', `Bearer ${token}`)
                    .send(nuovoPDI);

                //controllo risposta
                expect(risposta.statusCode).toBe(400);
                expect(risposta.body).toHaveProperty('error', 'La categoria è un campo obbligatorio');
            })
        })

        describe("(6) Creazione di un PDI con nome già esistente", () => {
            test("Status 409. La creazione fallisce. Il database rifiuta il duplicato e il sistema restituisce l'errore: Un PDI con questo nome esiste già.", async () => {

                // Genera token amministratore
                const token = jwt.sign(
                    { id: 1234, ruolo: 'amministratore' },
                    process.env.JWT_SECRET,
                    { expiresIn: '1m' }
                );

                //creo un pdi
                await PDI.create({
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: [11.11, 46.06]
                    },
                    properties: {
                        nome: "Muse",
                        categoria: "museo",
                        punteggio: 20,
                        immagine: []
                    }
                });
                
                //creo un pdi con lo stesso nome
                const pdiDuplicato = {
                    nome: "Muse",
                    categoria: "Museo",
                    punteggio: 20,
                    latitudine: 46.46,
                    longitudine: 11.11
                };

                const risposta = await request(app)
                    .post('/api/v1/pdi')
                    .set('Authorization', `Bearer ${token}`)
                    .send(pdiDuplicato);

                //risposta
                expect(risposta.statusCode).toBe(409);
                expect(risposta.body).toHaveProperty('error','Esiste già un Punto di Interesse con questo nome. Scegline uno diverso.');
            });
        })
        
        describe("(8) Creazione di un PDI con prezzo negativo", () => {
            test("Status 400. La validazione fallisce. Il sistema intercetta il valore inferiore a zero e restituisce l'errore: Il prezzo non può essere negativo.", async () => {

                // Genera token amministratore
                const token = jwt.sign(
                    { id: 1234, ruolo: 'amministratore' },
                    process.env.JWT_SECRET,
                    { expiresIn: '1m' }
                );
                
                //creo un pdi
                const nuovoPDI = {
                    nome: "Muse",
                    categoria: "Museo",
                    punteggio: 20,
                    latitudine: 46.46,
                    longitudine: 11.11,
                    prezzo: -5
                };

                const risposta = await request(app)
                    .post('/api/v1/pdi')
                    .set('Authorization', `Bearer ${token}`)
                    .send(nuovoPDI);

                //risposta
                expect(risposta.statusCode).toBe(400);
                expect(risposta.body).toHaveProperty('error','Il prezzo non può essere inferiore a 0');
            });
        })

        describe("(9) Tentativo di creazione di un PDI senza autenticazione", () => {
            test("Status 401. L'accesso viene negato dal middleware di controllo. Il sistema restituisce l'errore: Non autorizzato o Token mancante.", async () => {

                // Genera token amministratore
                const token = jwt.sign(
                    { id: 1234, ruolo: 'amministratore' },
                    process.env.JWT_SECRET || 'secret_di_test',
                    { expiresIn: '1m' }
                );
                
                //creo un pdi
                const nuovoPDI = {
                    nome: "Muse",
                    categoria: "Museo",
                    punteggio: 20,
                    latitudine: 46.46,
                    longitudine: 11.11
                };

                const risposta = await request(app)
                    .post('/api/v1/pdi')
                    .send(nuovoPDI);

                //risposta
                expect(risposta.statusCode).toBe(401);
                expect(risposta.body).toHaveProperty('error','Accesso negato: token mancante');
            });
        })
    });
});