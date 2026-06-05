import React from 'react'
import HomeNav from '../../components/homeComponents/HomeNav'
import '../../assets/home.css'

const rangi = [
    { min: 1,  max: 3,  colore: '#6c757d', sfondo: '#f1f3f5', etichetta: 'Principiante', icona: 'hiking' },
    { min: 4,  max: 7,  colore: '#037149', sfondo: '#edfbf0', etichetta: 'Esploratore',  icona: 'explore' },
    { min: 8,  max: 12, colore: '#0d6efd', sfondo: '#e7f0ff', etichetta: 'Avventuriero', icona: 'landscape' },
    { min: 13, max: 99, colore: '#e8a000', sfondo: '#fff8e1', etichetta: 'Leggenda',     icona: 'military_tech' },
]

const DashboardGiocatore = () => {
    const username = localStorage.getItem('nome') || 'Giocatore'

    const livello = 3
    const xp = 40
    const visitePDI = 5
    const visiteEventi = 2
    const xpPerLivelloCorrente = 32
    const xpPerProssimoLivello = 48

    const rango = rangi.find(r => livello >= r.min && livello <= r.max) || rangi[0]
    const xpNelLivello = xp - xpPerLivelloCorrente
    const xpNecessari = xpPerProssimoLivello - xpPerLivelloCorrente
    const progressoPerc = Math.min(100, Math.round((xpNelLivello / xpNecessari) * 100))
    const xpAlProssimo = xpNecessari - xpNelLivello

    return (
        <div className="vh-100 d-flex flex-column overflow-hidden">
            <div className="container-fluid">
                <HomeNav />
            </div>

            <div className="flex-grow-1 py-5 px-3 px-md-5" style={{ overflowY: 'auto', backgroundColor: '#f0f2f5' }}>
                <div style={{ maxWidth: '860px', margin: '0 auto' }}>

                    {/* Hero card */}
                    <div
                        className="card border-0 mb-4 overflow-hidden"
                        style={{
                            borderRadius: '24px',
                            background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 55%, #1d4ed8 100%)',
                            boxShadow: '0 8px 32px rgba(3,113,73,0.25)'
                        }}
                    >
                        {/* Cerchi decorativi di sfondo */}
                        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '220px', height: '220px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
                        <div style={{ position: 'absolute', bottom: '-60px', right: '80px', width: '160px', height: '160px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

                        <div className="card-body p-4 p-md-5 position-relative">
                            <div className="d-flex align-items-center gap-4 flex-wrap">

                                {/* Cerchio livello */}
                                <div
                                    className="d-flex align-items-center justify-content-center flex-shrink-0"
                                    style={{
                                        width: '100px', height: '100px', borderRadius: '50%',
                                        backgroundColor: 'rgba(255,255,255,0.15)',
                                        border: '3px solid rgba(255,255,255,0.35)',
                                        backdropFilter: 'blur(6px)'
                                    }}
                                >
                                    <div className="text-white text-center">
                                        <div style={{ fontSize: '2.2rem', fontWeight: 900, lineHeight: 1 }}>{livello}</div>
                                        <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.8 }}>LVL</div>
                                    </div>
                                </div>

                                {/* Testo e barra */}
                                <div className="flex-grow-1" style={{ minWidth: '180px' }}>
                                    <p className="mb-0 text-white" style={{ opacity: 0.75, fontSize: '0.85rem', fontWeight: 500 }}>
                                        Benvenuto,
                                    </p>
                                    <h3 className="fw-bold text-white mb-2" style={{ fontSize: '1.6rem', letterSpacing: '-0.02em' }}>
                                        {username}
                                    </h3>

                                    {/* Badge rango */}
                                    <div className="d-inline-flex align-items-center gap-1 px-3 py-1 mb-3 rounded-pill"
                                        style={{ backgroundColor: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.25)' }}>
                                        <span className="material-symbols-outlined fill text-white" style={{ fontSize: '0.95rem' }}>{rango.icona}</span>
                                        <span className="text-white fw-semibold" style={{ fontSize: '0.78rem', letterSpacing: '0.04em' }}>{rango.etichetta.toUpperCase()}</span>
                                    </div>

                                    {/* Barra XP */}
                                    <div>
                                        <div className="d-flex justify-content-between mb-1">
                                            <span className="text-white" style={{ fontSize: '0.8rem', opacity: 0.8 }}>{xp} XP</span>
                                            <span className="text-white" style={{ fontSize: '0.8rem', opacity: 0.65 }}>ancora {xpAlProssimo} XP → Liv. {livello + 1}</span>
                                        </div>
                                        <div style={{ height: '8px', borderRadius: '99px', backgroundColor: 'rgba(255,255,255,0.2)' }}>
                                            <div style={{ width: `${progressoPerc}%`, height: '100%', borderRadius: '99px', backgroundColor: 'rgba(255,255,255,0.85)', transition: 'width 0.6s ease' }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Titolo sezione */}
                    <p className="fw-semibold text-secondary mb-3 px-1" style={{ fontSize: '0.8rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                        Le tue statistiche
                    </p>

                    {/* Stat cards */}
                    <div className="row g-3 mb-4">

                        <div className="col-12 col-sm-4">
                            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '18px' }}>
                                <div className="card-body p-4">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                                            style={{ width: '48px', height: '48px', backgroundColor: 'rgba(3,113,73,0.1)' }}>
                                            <span className="material-symbols-outlined fill" style={{ fontSize: '1.5rem', color: '#037149' }}>star</span>
                                        </div>
                                        <div>
                                            <div className="fw-bold text-dark" style={{ fontSize: '1.7rem', lineHeight: 1.1 }}>{xp}</div>
                                            <div className="text-muted" style={{ fontSize: '0.82rem', fontWeight: 500 }}>XP Totali</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-sm-4">
                            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '18px' }}>
                                <div className="card-body p-4">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                                            style={{ width: '48px', height: '48px', backgroundColor: 'rgba(3,113,73,0.1)' }}>
                                            <span className="material-symbols-outlined fill" style={{ fontSize: '1.5rem', color: '#037149' }}>location_on</span>
                                        </div>
                                        <div>
                                            <div className="fw-bold text-dark" style={{ fontSize: '1.7rem', lineHeight: 1.1 }}>{visitePDI}</div>
                                            <div className="text-muted" style={{ fontSize: '0.82rem', fontWeight: 500 }}>Luoghi visitati</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-sm-4">
                            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '18px' }}>
                                <div className="card-body p-4">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                                            style={{ width: '48px', height: '48px', backgroundColor: 'rgba(3,113,73,0.1)' }}>
                                            <span className="material-symbols-outlined fill" style={{ fontSize: '1.5rem', color: '#037149' }}>event</span>
                                        </div>
                                        <div>
                                            <div className="fw-bold text-dark" style={{ fontSize: '1.7rem', lineHeight: 1.1 }}>{visiteEventi}</div>
                                            <div className="text-muted" style={{ fontSize: '0.82rem', fontWeight: 500 }}>Eventi partecipati</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>


                </div>
            </div>
        </div>
    )
}

export default DashboardGiocatore
