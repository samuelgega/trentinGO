import React, { useEffect } from 'react'

const ICONE_CATEGORIA = {
    lago: 'water',
    montagna: 'landscape',
    castello: 'castle',
    museo: 'museum',
    santuario: 'church',
    chiesa: 'church',
}

const ListaPDI = ({ pdiFiltrati, categorie, ricerca, setRicerca, categoriaSelezionata, setCategoriaSelezionata, PdiSelezionatoLista, pdiSelezionatoMappa }) => {

    useEffect(() => {
        if (pdiSelezionatoMappa) {
            const elementoCard = document.getElementById(`card-pdi-${pdiSelezionatoMappa._id}`);
            if (elementoCard) {
                elementoCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }, [pdiSelezionatoMappa]);

    return (
        <div className="h-100 d-flex flex-column p-4">
            <h3 className="fw-bold mb-3">Cerca nel trentino</h3>

            {/* Barra di ricerca */}
            <div className="pdi-search-wrapper mb-3">
                <span className="material-symbols-outlined pdi-search-icon">search</span>
                <input
                    type="text"
                    className="pdi-search-input"
                    placeholder="Cerca un posto..."
                    value={ricerca}
                    onChange={e => setRicerca(e.target.value)}
                />
                {ricerca && (
                    <button className="pdi-search-clear" onClick={() => setRicerca('')}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                )}
            </div>

            {/* Filtri categoria */}
            <div className="pdi-filtri-wrapper mb-3">
                <button
                    className={`pdi-chip ${!categoriaSelezionata ? 'pdi-chip--attivo' : ''}`}
                    onClick={() => setCategoriaSelezionata(null)}
                >
                    Tutti
                </button>
                {categorie.map(cat => (
                    <button
                        key={cat}
                        className={`pdi-chip ${categoriaSelezionata === cat ? 'pdi-chip--attivo' : ''}`}
                        onClick={() => setCategoriaSelezionata(prev => prev === cat ? null : cat)}
                    >
                        <span className="material-symbols-outlined pdi-chip-icon">
                            {ICONE_CATEGORIA[cat] || 'place'}
                        </span>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                ))}
            </div>

            {/* Contatore risultati */}
            <p className="pdi-risultati-count">
                {pdiFiltrati.length} {pdiFiltrati.length === 1 ? 'risultato' : 'risultati'}
            </p>

            {/* Lista card */}
            <div className="flex-grow-1 overflow-auto pdi-scroll-container pb-4">
                {pdiFiltrati.length === 0 ? (
                    <div className="pdi-empty-state">
                        <span className="material-symbols-outlined pdi-empty-icon">search_off</span>
                        <p>Nessun punto di interesse trovato</p>
                    </div>
                ) : (
                    pdiFiltrati.map((pdi) => {
                        const isSelezionato = pdiSelezionatoMappa && pdiSelezionatoMappa._id === pdi._id;
                        return (
                            <div
                                id={`card-pdi-${pdi._id}`}
                                key={pdi._id}
                                className={`pdi-card user-select-none ${isSelezionato ? 'border-success border-2 shadow' : 'shadow-sm'}`}
                                style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                                onClick={() => PdiSelezionatoLista(pdi)}
                            >
                                <div className="p-3">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <h5 className="mb-0 fw-semibold" style={{ color: '#1e293b' }}>
                                            {pdi.properties.nome}
                                        </h5>
                                        {pdi.properties.categoria && (
                                            <span className="pdi-badge-categoria">
                                                {pdi.properties.categoria}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-muted mb-3" style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                                        {pdi.properties.descrizione}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default ListaPDI;