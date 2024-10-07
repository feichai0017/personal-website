import type { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { email, message } = req.body

        // Create a transporter using SMTP
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        })

        try {
            // Send email
            await transporter.sendMail({
                from: process.env.SMTP_FROM,
                to: 'Ericsgc@outlook.com', // Your email address
                subject: 'New message from your website',
                text: `From: ${email}\n\nMessage: ${message}`,
                html: `<p><strong>From:</strong> ${email}</p><p><strong>Message:</strong> ${message}</p>`,
            })

            res.status(200).json({ message: 'Email sent successfully' })
        } catch (error) {
            console.error('Failed to send email:', error)
            res.status(500).json({ message: 'Failed to send email' })
        }
    } else {
        res.setHeader('Allow', ['POST'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}