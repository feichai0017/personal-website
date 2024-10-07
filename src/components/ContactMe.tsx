"use client"

import React, { useState } from 'react'
import { useTheme } from 'next-themes'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Send } from 'lucide-react'

export default function ContactMe() {
    const { theme } = useTheme()
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Here you would typically handle the form submission,
        // such as sending the data to an API
        console.log('Form submitted:', { email, message })
        // Reset form fields
        setEmail('')
        setMessage('')
    }

    return (
        <section id="contact" className="min-h-screen flex items-center justify-center py-24 px-4 bg-morandi-bg">
            <Card className={`w-full max-w-2xl shadow-xl ${
                theme === 'dark'
                    ? 'bg-morandi-dark text-morandi-light'
                    : 'bg-morandi-light text-morandi-dark'
            } transition-colors duration-300`}>
                <CardHeader className="pb-8">
                    <CardTitle className="text-4xl font-bold text-center">Contact Me</CardTitle>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                    <p className={`mb-8 text-center text-lg ${theme === 'dark' ? 'text-morandi-light-accent' : 'text-morandi-dark-accent'}`}>
                        Please contact me directly at{' '}
                        <a href="mailto:Ericsgc@outlook.com" className="text-morandi-accent hover:underline">
                            Ericsgc@outlook.com
                        </a>{' '}
                        or through this form.
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
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
                                }`}
                            />
                        </div>
                        <div>
                            <Textarea
                                placeholder="Your message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                                className={`w-full h-48 text-lg py-3 ${
                                    theme === 'dark'
                                        ? 'bg-morandi-dark-accent text-morandi-light'
                                        : 'bg-morandi-light-accent text-morandi-dark'
                                }`}
                            />
                        </div>
                        <Button
                            type="submit"
                            className={`w-full text-lg py-6 flex items-center justify-center gap-2 ${
                                theme === 'dark'
                                    ? 'bg-morandi-accent text-morandi-light hover:bg-morandi-accent-hover'
                                    : 'bg-morandi-accent text-morandi-dark hover:bg-morandi-accent-hover'
                            }`}
                        >
                            Submit <Send size={24} />
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </section>
    )
}