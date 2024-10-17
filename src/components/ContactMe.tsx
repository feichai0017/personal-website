'use client'

import React, { useState } from 'react'
import { useTheme } from 'next-themes'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Send, Coffee, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'

export default function ContactMe() {
    const { theme } = useTheme()
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, message }),
            })

            if (response.ok) {
                toast.success('Message sent successfully!')
                setEmail('')
                setMessage('')
            } else {
                throw new Error('Failed to send email')
            }
        } catch (error) {
            console.error('Error sending email:', error)
            toast.error('Failed to send message. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleBuyMeACoffee = () => {
        window.open('https://buymeacoffee.com/eric.sgc', '_blank')
    }

    return (
        <section id="contact" className="min-h-screen flex items-center justify-center py-24 px-4 bg-morandi-bg">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card className={`w-full max-w-2xl shadow-xl ${
                    theme === 'dark'
                        ? 'bg-morandi-dark text-morandi-light'
                        : 'bg-morandi-light text-morandi-dark'
                } transition-colors duration-300`}>
                    <CardHeader className="pb-8">
                        <CardTitle className="text-4xl font-bold text-center">Get in Touch</CardTitle>
                    </CardHeader>
                    <CardContent className="px-8 pb-8">
                        <p className={`mb-8 text-center text-lg ${theme === 'dark' ? 'text-morandi-light-accent' : 'text-morandi-dark-accent'}`}>
                            Feel free to reach out at{' '}
                            <a href="mailto:Ericsgc@outlook.com" className="text-morandi-accent hover:underline transition-colors duration-300">
                                Ericsgc@outlook.com
                            </a>{' '}
                            or use the form below.
                        </p>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Input
                                    type="email"
                                    placeholder="Your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className={`w-full text-lg py-3 ${
                                        theme === 'dark'
                                            ? 'bg-morandi-dark-accent text-morandi-light'
                                            : 'bg-morandi-light-accent text-morandi-dark'
                                    } transition-colors duration-300 focus:ring-2 focus:ring-morandi-accent`}
                                />
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Textarea
                                    placeholder="Your message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                    className={`w-full h-48 text-lg py-3 ${
                                        theme === 'dark'
                                            ? 'bg-morandi-dark-accent text-morandi-light'
                                            : 'bg-morandi-light-accent text-morandi-dark'
                                    } transition-colors duration-300 focus:ring-2 focus:ring-morandi-accent`}
                                />
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full text-lg py-6 flex items-center justify-center gap-2 ${
                                        theme === 'dark'
                                            ? 'bg-morandi-accent text-morandi-light hover:bg-morandi-accent-hover'
                                            : 'bg-morandi-accent text-morandi-dark hover:bg-morandi-accent-hover'
                                    } transition-colors duration-300`}
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Send size={24} />
                                    )}
                                    {isSubmitting ? 'Sending...' : 'Send Message'}
                                </Button>
                            </motion.div>
                        </form>
                        <div className="mt-8 text-center">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    onClick={handleBuyMeACoffee}
                                    className={`px-6 py-3 text-lg flex items-center justify-center gap-2 ${
                                        theme === 'dark'
                                            ? 'bg-yellow-500 text-morandi-dark hover:bg-yellow-600'
                                            : 'bg-yellow-500 text-morandi-light hover:bg-yellow-600'
                                    } transition-colors duration-300`}
                                >
                                    <Coffee size={24} />
                                    Buy Me a Coffee
                                </Button>
                            </motion.div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </section>
    )
}