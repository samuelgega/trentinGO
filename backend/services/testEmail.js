const { Resend } = require('resend')

const resend = new Resend(process.env.RESEND_API_KEY)

const inviaEmail = async (destinatario, oggetto, testo) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Trentingo <noreply@trentingo.dev>',
            to: destinatario,
            subject: oggetto,
            text: testo,
        })

        if (error) {
            throw error
        }

        return data
    } catch (error) {
        console.error(error)
        throw new Error("Errore durante l'invio dell'email")
    }
}

module.exports = inviaEmail

module.exports = inviaEmail