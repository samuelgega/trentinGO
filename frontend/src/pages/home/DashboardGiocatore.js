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

            <div className="flex-grow-1 py-4 px-3 px-md-5" style={{ overflowY: 'auto', backgroundColor: '#f0f2f5' }}>
                <div>

                    <div className="row g-4 align-items-stretch" style={{ maxWidth: '1300px', margin: '0 auto' }}>

                        {/* ── Colonna sinistra ── */}
                        <div className="col-12 col-lg-7 d-flex flex-column gap-4">

                            {/* Sezione livello */}
                            <div>
                                <p className="fw-semibold text-secondary mb-3 px-1" style={{ fontSize: '0.75rem', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                                    Livello
                                </p>

                                {/* Hero card */}
                                <div
                                    className="card border-0 mb-3 overflow-hidden position-relative"
                                    style={{
                                        borderRadius: '22px',
                                        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 55%, #1d4ed8 100%)',
                                        boxShadow: '0 8px 28px rgba(15,23,42,0.28)'
                                    }}
                                >
                                    <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
                                    <div style={{ position: 'absolute', bottom: '-50px', right: '70px', width: '140px', height: '140px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

                                    <div className="card-body p-4 position-relative">
                                        <div className="d-flex align-items-center gap-4 flex-wrap">
                                            <div
                                                className="d-flex align-items-center justify-content-center flex-shrink-0"
                                                style={{ width: '90px', height: '90px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)', border: '3px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(6px)' }}
                                            >
                                                <div className="text-white text-center">
                                                    <div style={{ fontSize: '2rem', fontWeight: 900, lineHeight: 1 }}>{livello}</div>
                                                    <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.75 }}>LVL</div>
                                                </div>
                                            </div>
                                            <div className="flex-grow-1" style={{ minWidth: '160px' }}>
                                                <p className="mb-0 text-white" style={{ opacity: 0.7, fontSize: '0.82rem' }}>Benvenuto,</p>
                                                <h4 className="fw-bold text-white mb-2" style={{ fontSize: '1.4rem', letterSpacing: '-0.02em' }}>{username}</h4>
                                                <div className="d-inline-flex align-items-center gap-1 px-3 py-1 mb-3 rounded-pill"
                                                    style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.22)' }}>
                                                    <span className="material-symbols-outlined fill text-white" style={{ fontSize: '0.9rem' }}>{rango.icona}</span>
                                                    <span className="text-white fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '0.04em' }}>{rango.etichetta.toUpperCase()}</span>
                                                </div>
                                                <div className="d-flex justify-content-between mb-1">
                                                    <span className="text-white" style={{ fontSize: '0.78rem', opacity: 0.8 }}>{xp} XP</span>
                                                    <div className="d-inline-flex align-items-center gap-1 px-2 py-1 rounded-pill"
                                                    style={{ backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}>
                                                    <span className="material-symbols-outlined fill text-white" style={{ fontSize: '0.85rem' }}>bolt</span>
                                                    <span className="text-white fw-bold" style={{ fontSize: '0.78rem' }}>+{xpAlProssimo} XP</span>
                                                    <span className="text-white" style={{ fontSize: '0.78rem', opacity: 0.6 }}>→ LVL {livello + 1}</span>
                                                </div>
                                                </div>
                                                <div style={{ height: '7px', borderRadius: '99px', backgroundColor: 'rgba(255,255,255,0.18)' }}>
                                                    <div style={{ width: `${progressoPerc}%`, height: '100%', borderRadius: '99px', backgroundColor: 'rgba(255,255,255,0.82)', transition: 'width 0.6s ease' }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Stat cards */}
                                <div className="row g-3">
                                    {[
                                        { icona: 'star',        valore: xp,           etichetta: 'XP Totali' },
                                        { icona: 'location_on', valore: visitePDI,    etichetta: 'Luoghi visitati' },
                                        { icona: 'event',       valore: visiteEventi, etichetta: 'Eventi visitati' },
                                    ].map(({ icona, valore, etichetta }) => (
                                        <div key={etichetta} className="col-4">
                                            <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                                                <div className="card-body p-3 p-md-4">
                                                    <div className="d-flex align-items-center gap-3">
                                                        <div className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                                                            style={{ width: '44px', height: '44px', backgroundColor: 'rgba(3,113,73,0.1)' }}>
                                                            <span className="material-symbols-outlined fill" style={{ fontSize: '1.3rem', color: '#037149' }}>{icona}</span>
                                                        </div>
                                                        <div>
                                                            <div className="fw-bold text-dark" style={{ fontSize: '1.5rem', lineHeight: 1.1 }}>{valore}</div>
                                                            <div className="text-muted" style={{ fontSize: '0.78rem', fontWeight: 500 }}>{etichetta}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Sezione storico visite */}
                            <div className="flex-grow-1">
                                <p className="fw-semibold text-secondary mb-3 px-1" style={{ fontSize: '0.75rem', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                                    Storico visite
                                </p>
                                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '22px', minHeight: '200px' }}>
                                    <div className="card-body d-flex flex-column align-items-center justify-content-center text-center p-5" style={{ opacity: 0.45 }}>
                                        <span className="material-symbols-outlined mb-2" style={{ fontSize: '2.5rem', color: '#6c757d' }}>history</span>
                                        <span className="fw-semibold text-secondary" style={{ fontSize: '0.9rem' }}>In arrivo</span>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* ── Colonna destra: Achievement ── */}
                        <div className="col-12 col-lg-5 d-flex flex-column">
                            <p className="fw-semibold text-secondary mb-3 px-1" style={{ fontSize: '0.75rem', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                                Achievements
                            </p>
                            <div className="card border-0 shadow-sm flex-grow-1" style={{ borderRadius: '22px', minHeight: '300px' }}>
                                <div className="card-body d-flex flex-column align-items-center justify-content-center text-center p-5" style={{ opacity: 0.45 }}>
                                    <span className="material-symbols-outlined mb-2" style={{ fontSize: '2.5rem', color: '#6c757d' }}>emoji_events</span>
                                    <span className="fw-semibold text-secondary" style={{ fontSize: '0.9rem' }}>In arrivo</span>
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
