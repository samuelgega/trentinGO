import React from 'react'
import HomeNav from '../../components/homeComponents/HomeNav'
import '../../assets/home.css'

const coloriLivello = [
    { min: 1, max: 3, colore: '#6c757d', etichetta: 'Principiante' },
    { min: 4, max: 7, colore: '#037149', etichetta: 'Esploratore' },
    { min: 8, max: 12, colore: '#0d6efd', etichetta: 'Avventuriero' },
    { min: 13, max: 99, colore: '#e8a000', etichetta: 'Leggenda' },
]

const DashboardGiocatore = () => {
    const username = localStorage.getItem('nome') || 'Giocatore'

    const livello = 3
    const xp = 40
    const visitePDI = 5
    const visiteEventi = 2
    const xpPerLivelloCorrente = 32
    const xpPerProssimoLivello = 48

    const rango = coloriLivello.find(r => livello >= r.min && livello <= r.max) || coloriLivello[0]
    const xpNelLivello = xp - xpPerLivelloCorrente
    const xpNecessari = xpPerProssimoLivello - xpPerLivelloCorrente
    const progressoPerc = Math.min(100, Math.round((xpNelLivello / xpNecessari) * 100))

    return (
        <div className="vh-100 d-flex flex-column overflow-hidden">
            <div className="container-fluid">
                <HomeNav />
            </div>

            <div className="flex-grow-1 py-5 px-4 px-md-5 bg-light" style={{ overflowY: 'auto' }}>
                <div className="container-lg">

                    {/* Header */}
                    <div className="mb-5">
                        <h2 className="fw-bold text-dark mb-1">Ciao, {username}!</h2>
                        <p className="text-muted fs-5 mb-0">Ecco i tuoi progressi su TrentinGO</p>
                    </div>

                    {/* Card livello + barra XP */}
                    <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '20px' }}>
                        <div className="card-body p-4 p-md-5">
                            <div className="row align-items-center g-4">
                                <div className="col-auto">
                                    <div
                                        className="d-flex align-items-center justify-content-center rounded-circle"
                                        style={{ width: '90px', height: '90px', backgroundColor: rango.colore, flexShrink: 0 }}
                                    >
                                        <div className="text-white text-center">
                                            <div style={{ fontSize: '1.9rem', fontWeight: 800, lineHeight: 1 }}>{livello}</div>
                                            <div style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>LVL</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="d-flex align-items-center gap-2 mb-1">
                                        <span className="fw-bold text-dark" style={{ fontSize: '1.2rem' }}>Livello {livello}</span>
                                        <span
                                            className="badge rounded-pill px-3 py-1"
                                            style={{ backgroundColor: `${rango.colore}22`, color: rango.colore, fontSize: '0.75rem', fontWeight: 700 }}
                                        >
                                            {rango.etichetta}
                                        </span>
                                    </div>
                                    <div className="text-muted mb-2" style={{ fontSize: '0.88rem' }}>
                                        {xp} XP &mdash; ancora <strong>{xpNecessari - xpNelLivello} XP</strong> al prossimo livello
                                    </div>
                                    <div className="progress" style={{ height: '10px', borderRadius: '99px', backgroundColor: '#e9ecef' }}>
                                        <div
                                            className="progress-bar"
                                            style={{ width: `${progressoPerc}%`, backgroundColor: rango.colore, borderRadius: '99px', transition: 'width 0.6s ease' }}
                                        />
                                    </div>
                                    <div className="d-flex justify-content-between mt-1">
                                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>Liv. {livello}</span>
                                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>Liv. {livello + 1}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stat cards */}
                    <div className="row g-3">
                        <div className="col-12 col-sm-4">
                            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                                <div className="card-body p-4 text-center">
                                    <span className="material-symbols-outlined fill mb-2" style={{ fontSize: '2.2rem', color: '#037149' }}>star</span>
                                    <div className="fw-bold text-dark" style={{ fontSize: '2rem' }}>{xp}</div>
                                    <div className="text-muted small fw-semibold">XP Totali</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-sm-4">
                            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                                <div className="card-body p-4 text-center">
                                    <span className="material-symbols-outlined fill mb-2" style={{ fontSize: '2.2rem', color: '#037149' }}>location_on</span>
                                    <div className="fw-bold text-dark" style={{ fontSize: '2rem' }}>{visitePDI}</div>
                                    <div className="text-muted small fw-semibold">Luoghi visitati</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-sm-4">
                            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                                <div className="card-body p-4 text-center">
                                    <span className="material-symbols-outlined fill mb-2" style={{ fontSize: '2.2rem', color: '#037149' }}>event</span>
                                    <div className="fw-bold text-dark" style={{ fontSize: '2rem' }}>{visiteEventi}</div>
                                    <div className="text-muted small fw-semibold">Eventi partecipati</div>
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
