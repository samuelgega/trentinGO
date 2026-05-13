import React from 'react';

const PopUpElimina = ({ isOpen, onClose, onConfirm, nomeElemento}) => {
    //se non è aperto ritorna null
    if(!isOpen) return null;

    return (
        <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Conferma Eliminazione</h5>
                        <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <p>Sei sicuro di voler eliminare {nomeElemento}?</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Annulla</button>
                        <button type="button" className="btn btn-danger" onClick={onConfirm}>Elimina</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PopUpElimina;


