import React, { Component } from 'react'
import { withNavigation } from './withNavigation'

class CreaPDI extends Component {
    constructor(props) {
        super(props)
        this.fileInputRef = React.createRef() //ref per l'input delle immagini
        this.state = {
            nome: '',
            tipo: '',
            latitudine: '',
            longitudine: '',
            descrizione: '',
            prezzo: 0,
            punteggio: 0,
            immagini: []
        }
    }

    //handler per andare alla pagina gestione pdi
    goToGestionePDI = () => {
        this.props.navigate('/gestisci-pdi')
    }

    //handler reset dei file caricati
    resetFiles = () => {
        //svuota il valore visualizzato nel browser
        if (this.fileInputRef.current) {
            this.fileInputRef.current.value = ""
        }
        //svuota l'array nello stato
        this.setState({immagini: []})
    }

    //handlers per gli input
    handleNome = e => {
        const v = e.target.value
        this.setState({ nome: v })
        console.log(this.state)
    }
    handleTipo = e => {
        const v = e.target.value
        this.setState({ tipo: v })
    }
    handleLatitudine = e => {
        const v = e.target.value
        this.setState({ latitudine: v })
    }
    handleLongitudine = e => {
        const v = e.target.value
        this.setState({ longitudine: v })
    }
    handleDescrizione = e => {
        const v = e.target.value
        this.setState({ descrizione: v })
    }
    handlePrezzo = e => {
        const v = e.target.value
        this.setState({ prezzo: v })
    }
    handlePunteggio = e => {
        const v = e.target.value
        this.setState({ punteggio: v })
    }

    handleImg = e => {
        const MAX_SIZE = 2 * 1024 * 1024; //2MB
        const MAX_IMG = 10
        const TIPI_IMG = ['image/jpeg', 'image/png', 'image/webp'];
        const immagini = Array.from(e.target.files)
        immagini = immagini.slice(0, MAX_IMG)
        const immaginiValide = []
        immagini.forEach(f => {
            if(f.size < MAX_SIZE && TIPI_IMG.includes(f.type))
                immaginiValide.push(f)
        })
        this.setState({immagini: immaginiValide})
    }

    //handler per il submit
    handleSubmit = () => {
        alert('Hai fatto il submit')
    }

    render() {
        return (
            <div className="container mt-4 mb-5">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>CreanNuovo Punto di Interesse</h2>
                    <button
                        className="btn btn-outline-secondary"
                        onClick={this.goToGestionePDI}
                    >
                        &larr; Annulla e torna indietro
                    </button>
                </div>

                <div className="card shadow border-0">
                    <div className="card-body p-4">
                        <form onSubmit={this.handleSubmit}>

                            {/* SEZIONE 1: Informazioni base */}
                            <h5 className="text-primary mb-3">1. Informazioni Generali</h5>
                            <div className="row g-3 mb-4">
                                <div className="col-md-8">
                                    <label className="form-label fw-bold">Nome del punto di interesse</label>
                                    <input type="text" name="nome" className="form-control" placeholder="es. Piazza Duomo" required onChange={this.handleNome} />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label fw-bold">Tipologia</label>
                                    <select name="tipo" className="form-select" onChange={this.handleTipo}>
                                        <option value="">Selezionare tipologia</option>
                                        <option value="Monumento">Monumento</option>
                                        <option value="Museo">Museo</option>
                                        <option value="Parco">Parco</option>
                                        <option value="Sentiero">Sentiero</option>
                                        <option value="Lago">Lago</option>
                                        <option value="Altro">Altro</option>
                                    </select>
                                </div>
                            </div>
                            <div className="row g-3 mb-4">
                                <label className="form-label fw-bold">Descrizione Estesa</label>
                                <textarea name="descrizione" className="form-control" rows="4" placeholder="Inserisci una descrizione dettagliata..." onChange={this.handleDescrizione}></textarea>
                            </div>

                            <hr />

                            {/* SEZIONE 2: Posizione */}
                            <h5 className="text-primary mb-3">2. Posizione Geografica</h5>
                            <div className="row g-3 mb-4">
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Latitudine</label>
                                    <input type="number" step="any" name="latitudine" className="form-control" placeholder="46.067..." onChange={this.handleLatitudine} />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Longitudine</label>
                                    <input type="number" step="any" name="longitudine" className="form-control" placeholder="11.121..." onChange={this.handleLongitudine} />
                                </div>
                            </div>

                            <hr />

                            {/* SEZIONE 3: Dettagli */}
                            <h5 className="text-primary mb-3">3. Dettagli</h5>
                            <div className="row g-3 mb-4">
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Punteggio</label>
                                    <input type="number" step="any" name="punteggio" className="form-control" placeholder="100" required onChange={this.handlePunteggio} />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Prezzo</label>
                                    <input type="number" step="any" name="prezzo" className="form-control" placeholder="10" onChange={this.handlePrezzo}/>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Foto (URL o File)</label>
                                    <div className="input-group">
                                        <input
                                            type="file"
                                            className="form-control"
                                            multiple
                                            ref={this.fileInputRef}
                                            onChange={this.handleImg}
                                            accept="image/jpeg, image/png, image/webp"
                                        />
                                        <button
                                            className="btn btn-outline-danger"
                                            type="button"
                                            onClick={this.resetFiles}
                                        >
                                            Annulla
                                        </button>
                                    </div>
                                    <small className="text-muted">Puoi selezionare più file contemporaneamente (max. 2MB per file)</small><br/>
                                    <small className="text-muted">Tipi di file ammessi: JPEG, PNG, WEBP. Massimo 10 immagini</small>
                                </div>
                            </div>

                            {/* tasti azione */}
                            <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                                <button type="reset" className="btn btn-light me-md-2">Svuota Campi</button>
                                <button type="submit" className="btn btn-primary px-5">Salva PDI</button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

// Esporta il componente avvolto nel wrapper per poter navigare
export default withNavigation(CreaPDI);