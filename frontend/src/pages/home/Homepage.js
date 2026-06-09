import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import HomeNav from '../../components/homeComponents/HomeNav';
import MappaTrentino from '../../components/homeComponents/MappaTrentino';
import ListaPDI from '../../components/homeComponents/ListaPDI';
import { useAlert } from '../../contexts/AlertController';
import '../../assets/home.css'

const Homepage = () => {

  const { showAlert } = useAlert();
  const location = useLocation();

  const [pdiSelezionato, setPdiSelezionato] = useState(null);
  const [listaPDI, setListaPDI] = useState([]);
  const [pdiVisitati, setPdiVisitati] = useState(new Set());

  useEffect(() => {
    const ruolo = localStorage.getItem('ruolo')
    if (ruolo !== 'giocatore') return
    const token = localStorage.getItem('token')
    fetch(`${process.env.REACT_APP_API_URL}/api/v1/visite/giocatore?soloId=true`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(json => {
        const ids = new Set(json.data?.map(v => v.idPDI).filter(Boolean))
        setPdiVisitati(ids)
      })
      .catch(() => {})
  }, [location.key])

  // Seleziona un PDI oppure lo deseleziona se è già quello attivo
  const togglePdiSelezionato = (pdi) => {
    setPdiSelezionato(prev => prev?._id === pdi._id ? null : pdi);
  };

  // Testo digitato nella barra di ricerca
  const [ricerca, setRicerca] = useState('');
  // Categoria selezionata tramite i chip (null = "Tutti")
  const [categoriaSelezionata, setCategoriaSelezionata] = useState(null);
  // Contatore incrementato ogni volta che si clicca un chip: segnala alla mappa di tornare allo zoom default
  const [resetMappaKey, setResetMappaKey] = useState(0);

  // Quando si clicca un chip categoria: aggiorna il filtro, deseleziona l'eventuale PDI attivo e resetta lo zoom della mappa
  const handleSetCategoria = (cat) => {
    setCategoriaSelezionata(cat);
    setPdiSelezionato(null);
    setResetMappaKey(k => k + 1);
  };

  // Recupera tutti i PDI dal backend al primo caricamento della pagina
  useEffect(() => {
    const recuperoPDI = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/pdi`);
        if (!response.ok) throw new Error(`Errore HTTP: ${response.status}`);
        const jsonResponse = await response.json();
        setListaPDI(jsonResponse.data);
      } catch (error) {
        console.error("Errore di connessione:", error);
        showAlert("Errore di connessione. Assicurati che il backend sia acceso!");
      }
    };
    recuperoPDI();
  }, [showAlert]);

  // Ricava le categorie uniche dalla lista PDI per popolare i chip filtro
  const categorie = useMemo(() => {
    const uniche = [...new Set(listaPDI.map(p => p.properties.categoria?.toLowerCase()).filter(Boolean))];
    return uniche.sort();
  }, [listaPDI]);

  // Applica ricerca testuale e filtro per categoria sulla lista completa
  const pdiFiltrati = useMemo(() => {
    return listaPDI.filter(pdi => {
      const matchRicerca = pdi.properties.nome.toLowerCase().includes(ricerca.toLowerCase());
      const matchCategoria = !categoriaSelezionata || pdi.properties.categoria === categoriaSelezionata;
      return matchRicerca && matchCategoria;
    });
  }, [listaPDI, ricerca, categoriaSelezionata]);

  return (
    <div className='vh-100 d-flex flex-column overflow-hidden'>
      <div className='container-fluid'>
        <HomeNav />
      </div>

      <div className='container-fluid p-0 w-100 flex-grow-1 overflow-hidden'>
        <div className='row g-0 h-100'>

          {/* Colonna sinistra: mappa con i marker filtrati */}
          <div className="col-12 col-lg-8 col-mappa position-relative p-0">
            <MappaTrentino
              pdiFiltrati={pdiFiltrati}
              pdiSelezionatoLista={pdiSelezionato}
              PdiSelezionatoMappa={setPdiSelezionato}
              resetMappaKey={resetMappaKey}
              pdiVisitati={pdiVisitati}
            />
          </div>

          {/* Colonna destra: barra di ricerca, chip filtro e lista PDI */}
          <div className="col-12 col-lg-4 bg-light overflow-hidden border-start col-lista p-0">
            <ListaPDI
              pdiFiltrati={pdiFiltrati}
              categorie={categorie}
              ricerca={ricerca}
              setRicerca={setRicerca}
              categoriaSelezionata={categoriaSelezionata}
              setCategoriaSelezionata={handleSetCategoria}
              PdiSelezionatoLista={togglePdiSelezionato}
              pdiSelezionatoMappa={pdiSelezionato}
              pdiVisitati={pdiVisitati}
              setPdiVisitati={setPdiVisitati}
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Homepage;
