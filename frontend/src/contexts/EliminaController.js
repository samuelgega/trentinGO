import React from 'react';

const PopUpElimina = ({ isOpen, onClose, onConfirm, nomeElemento}) => {
    //se non è aperto ritorna null
    if(!isOpen) return null;

    return (
        <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-top">
                <div className="modal-content shadow-lg border-0">
                    <div className="modal-header bd-danger ">
                        <h5 className="modal-title fw-bold">Conferma Eliminazione</h5>
                        <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
                    </div>
                    <div className="modal-body text-center p-4">
                        <p className='fs-5 mb-1'>Sei sicuro di voler eliminare: </p>
                        <p className="fw-bold fs-4 text-danger">{nomeElemento}</p>
                        
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


