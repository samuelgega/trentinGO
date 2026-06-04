import React, { useEffect, useState } from 'react'

const NotificaVisita = ({ notifica, onHide }) => {
    const [fase, setFase] = useState('nascosto')

    useEffect(() => {
        if (!notifica) return
        setFase('entra')
        const timerEsci = setTimeout(() => setFase('esci'), 2800)
        const timerNascondi = setTimeout(() => { setFase('nascosto'); onHide() }, 3400)
        return () => { clearTimeout(timerEsci); clearTimeout(timerNascondi) }
    }, [notifica])

    if (!notifica || fase === 'nascosto') return null

    return (
        <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 9999,
            animation: fase === 'entra' ? 'notifica-entra 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' : 'notifica-esci 0.5s ease forwards',
            pointerEvents: 'none'
        }}>
            <div style={{
                backgroundColor: 'rgba(15, 25, 20, 0.96)',
                border: '1px solid rgba(3, 113, 73, 0.6)',
                borderRadius: '20px',
                padding: '28px 36px',
                minWidth: '280px',
                maxWidth: '360px',
                textAlign: 'center',
                boxShadow: '0 0 40px rgba(3, 113, 73, 0.25), 0 20px 60px rgba(0,0,0,0.4)',
            }}>
                {/* Icona */}
                <div style={{
                    width: '56px', height: '56px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(3, 113, 73, 0.2)',
                    border: '2px solid #037149',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 16px'
                }}>
                    <span className="material-symbols-outlined fill" style={{ color: '#4ade80', fontSize: '1.8rem' }}>
                        {notifica.levelUp ? 'emoji_events' : 'thumb_up'}
                    </span>
                </div>

                {/* Titolo */}
                <div style={{ color: '#4ade80', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '6px' }}>
                    {notifica.levelUp ? 'Livello Superiore!' : 'PDI Scoperto!'}
                </div>
                <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '1.15rem', marginBottom: '16px' }}>
                    {notifica.levelUp ? `Hai raggiunto il livello ${notifica.levelUp}` : notifica.nome}
                </div>

                {/* XP */}
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    backgroundColor: 'rgba(3, 113, 73, 0.25)',
                    border: '1px solid rgba(3, 113, 73, 0.5)',
                    borderRadius: '999px',
                    padding: '5px 16px'
                }}>
                    <span className="material-symbols-outlined fill" style={{ color: '#fbbf24', fontSize: '1rem' }}>star</span>
                    <span style={{ color: '#fbbf24', fontWeight: 700, fontSize: '0.95rem' }}>+{notifica.punteggio} XP</span>
                </div>
            </div>
        </div>
    )
}

export default NotificaVisita
