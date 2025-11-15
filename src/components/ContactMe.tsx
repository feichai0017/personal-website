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
import emailjs from '@emailjs/browser';

export default function ContactMe() {
    const { theme } = useTheme()
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await emailjs.send(
                process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
                process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
                {
                    from_email: email,
                    message: message
                },
                process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
            );

            toast.success('Message sent successfully!');
            setEmail('');
            setMessage('');
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to send message');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBuyMeACoffee = () => {
        window.open('https://buymeacoffee.com/eric.sgc', '_blank')
    }

    return (
        <section id="contact" className="min-h-screen flex items-center justify-center py-24 px-4 bg-morandi-bg dark:bg-morandi-dark transition-colors duration-500">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card className={`w-full max-w-2xl shadow-2xl border ${
                    theme === 'dark'
                        ? 'bg-white/5 backdrop-blur-2xl border-white/10 text-morandi-dark'
                        : 'bg-white text-morandi-dark border-morandi-accent/15'
                } transition-colors duration-300`}>
                    <CardHeader className="pb-8">
                        <CardTitle className="text-4xl font-bold text-center">Get in Touch</CardTitle>
                    </CardHeader>
                    <CardContent className="px-8 pb-8">
                        <p className={`mb-8 text-center text-lg ${theme === 'dark' ? 'text-morandi-dark/80' : 'text-morandi-text/80'}`}>
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
                                            ? 'bg-white/10 border-white/10 text-morandi-dark placeholder:text-morandi-dark/60'
                                            : 'bg-morandi-light-accent text-morandi-dark placeholder:text-morandi-text/60'
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
                                            ? 'bg-white/10 border-white/10 text-morandi-dark placeholder:text-morandi-dark/60'
                                            : 'bg-morandi-light-accent text-morandi-dark placeholder:text-morandi-text/60'
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
