import React, { createContext, useContext, useState } from 'react'

const AlertContext = createContext()

export const useAlert = () => useContext(AlertContext)

export const AlertProvider = ({ children }) => {
    const [alert, setAlert] = useState(null)

    //funzione per mostrare un'alert
    const showAlert = (titolo, testo, tipo = 'success') => {
        setAlert({ titolo, testo, tipo })

        //chiude l'alert in automatico dopo 5 secondi
        setTimeout(() => {
            setAlert(null)
        }, 5000)
    }

    return (
        <AlertContext.Provider value={{ showAlert }}>
            {children}

            {alert && (
                <div
                    style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999, minWidth: '300px' }}
                    className={`alert alert-${alert.tipo} alert-dismissible fade show shadow`}
                    role="alert"
                >
                    <strong>{alert.titolo}</strong> <br /> {alert.testo}
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setAlert(null)}
                        aria-label="Close"
                    ></button>
                </div>
            )}
        </AlertContext.Provider>
    )
}