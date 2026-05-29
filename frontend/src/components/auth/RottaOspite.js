import React from 'react'
import { Navigate } from 'react-router-dom'

const RottaOspite = ({ children }) => {
    const token = localStorage.getItem('token')
    const ruoloUtente = localStorage.getItem('ruolo')

    if (token && ruoloUtente) {
        switch (ruoloUtente) {
            case 'amministratore':
                return <Navigate to="/admin-home" replace />
            case 'gestore':
                return <Navigate to="/gestore-home" replace />
            default:
                return <Navigate to="/home" replace />
        }
    }

    return children
}

export default RottaOspite