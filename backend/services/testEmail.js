const nodemailer = require('nodemailer')

const MITTENTE_EMAIL = process.env.MITTENTE_EMAIL || '<noreply@trentingo.it>'

const inviaEmail = async (destinatario, oggetto, testo) => {
    try {
        const testAccount = await nodemailer.createTestAccount()

        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: false,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD
            }
        })

        const info = await transporter.sendMail({
            from: MITTENTE_EMAIL,
            to: destinatario,
            subject: oggetto,
            text: testo
        })

        // console.log("Email inviata: %s", info.messageId)
        // console.log("Link di visualizzazione: %s", nodemailer.getTestMessageUrl(info)) //anteprima "finta" dell'email su Ethereal
    }
    catch (error) {
        console.error("Errore durante la creazione dell'account di test:", error)
        throw new Error("Impossibile creare l'account di test per l'invio delle email")
    }
}

module.exports = inviaEmail