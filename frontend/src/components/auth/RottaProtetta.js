import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAlert } from '../../contexts/AlertController'

const RottaProtetta = ({ children, ruoliAmmessi }) => {
    const token = localStorage.getItem('token')
    const ruoloUtente = localStorage.getItem('ruolo')

    const { showAlert } = useAlert()

    if (!token) {
        return <Navigate to="/auth/login" replace />
    }

    if (ruoliAmmessi && !ruoliAmmessi.includes(ruoloUtente)) {
        setTimeout(() => { //timeout inserrito per completare il rendering prima di mostrare l'alert
            showAlert("Accesso negato", "Non hai i permessi necessari per accedere a questa pagina", "danger")
        }, 1)
        return <Navigate to="/home" replace />
    }

    return children
}

export default RottaProtetta