//file modello per testare se funziona jest e il db


const request = require('supertest');
const app = require('../app');
const dbTest = require('./config/dbTest'); //importiamo il db
const Giocatore = require('../models/Giocatore'); //impostiamo il modello da testare

//gestiamo il db in memoria
beforeAll(async () => await dbTest.connect());// Accende il DB in memoria prima di iniziare
afterAll(async () => await dbTest.closeDatabase());// Spegne il DB alla fine di tutti i test
afterEach(async () => await dbTest.clearDatabase());// Svuota i dati dopo ogni singolo test

describe('=== SUITE DI MODELLO BASE (VERIFICA SETUP) ===', () => {
  
  //Test generici sull'infrastruttura di Express
  describe('Rotte Generiche ed Errori Globali', () => {
    
    it('should return 404 for a non-existent route', async () => {
      const res = await request(app).get('/api/v1/non-existent');
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('error', 'Risorsa non trovata');
    });

    it('should have the swagger docs available', async () => {
      const res = await request(app).get('/api-docs/');
      expect(res.statusCode).toBeLessThan(400);
    });
  });

  //Verifica che il Database in memoria funzioni
  describe('Verifica Connessione e Scrittura Database Temporaneo', () => {
    
    it('should successfully write and read a document from the in-memory database', async () => {
      //Verifichiamo che il database sia vuoto
      const conteggioIniziale = await Giocatore.countDocuments();
      expect(conteggioIniziale).toBe(0);

      //Eseguiamo una scrittura nel database temporaneo
      const nuovoUtenteTest = await Giocatore.create({
        username: "test_setup",
        email: "setup@test.com",
        password: "$2b$10$fakesaltforpasswordtesting",
        iscrittoNewsletter: false
      });

      //Verifichiamo che Mongoose abbia generato l'ID e salvato i dati correttamente
      expect(nuovoUtenteTest).toHaveProperty('_id');
      expect(nuovoUtenteTest.username).toBe("test_setup");

      //Verifichiamo che adesso nel DB ci sia effettivamente 1 documento registrato
      const conteggioFinale = await Giocatore.countDocuments();
      expect(conteggioFinale).toBe(1);
    });
  });

});