import { NextApiRequest, NextApiResponse } from 'next'
import { google } from 'googleapis'
import nodemailer from 'nodemailer'

const oauth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
)

oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN
})

const sendMail = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    const { email, message } = req.body

    try {
        const accessToken = await oauth2Client.getAccessToken()

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'songguocheng348@gmail.com',
                clientId: process.env.GMAIL_CLIENT_ID,
                clientSecret: process.env.GMAIL_CLIENT_SECRET,
                refreshToken: process.env.GMAIL_REFRESH_TOKEN,
                accessToken: accessToken as string,
            },
        })

        const mailOptions = {
            from: 'your-email@gmail.com',
            to: 'Ericsgc@outlook.com',
            subject: 'New Contact Form Submission',
            text: `You have a new submission from ${email}:\n\n${message}`,
            html: `<p>You have a new submission from ${email}:</p><p>${message}</p>`,
        }

        await transport.sendMail(mailOptions)

        res.status(200).json({ message: 'Email sent successfully' })
    } catch (error) {
        console.error('Error sending email:', error)
        res.status(500).json({ message: 'Error sending email' })
    }
}

export default sendMail