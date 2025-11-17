'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import emailjs from '@emailjs/browser'
import { Send, Coffee, Loader2, Command, Terminal as TerminalIcon, Wifi } from 'lucide-react'

interface CommandEntry {
    id: string
    variant: 'command' | 'response'
    content: string | string[]
}

interface StatusEntry {
    id: string
    variant: 'status'
    label: string
    value: string
}

type TerminalEntry = CommandEntry | StatusEntry
type TerminalEntryInput = Omit<CommandEntry, 'id'> | Omit<StatusEntry, 'id'>

const commandDictionary: Record<string, string> = {
    help: 'list all available commands',
    compose: 'toggle message buffer',
    exit: 'close composer mode',
    status: 'print live diagnostics',
    links: 'show external handles',
    coffee: 'launch support console',
    clear: 'reset terminal history',
    theme: 'switch theme (light/dark/system)'
}

const baseTemplate: TerminalEntryInput[] = [
    { variant: 'response', content: 'Booting Morandi Console v2.3...' },
    { variant: 'response', content: 'Establishing encrypted link with Eric...' },
    { variant: 'status', label: 'Channel', value: 'Encrypted ✅' },
    { variant: 'status', label: 'Mode', value: 'Interactive' }
]

const createBaseLogs = (): TerminalEntry[] =>
    baseTemplate.map((entry, index) => ({
        ...entry,
        id: `boot-${index}-${Date.now()}`
    }))

const MAX_TERMINAL_LOGS = 120

type NetworkDiagnostics = {
    latency: number | null
    downlink: number | null
    status: 'Idle' | 'Testing' | 'OK' | 'Error'
    lastChecked: string | null
    isChecking: boolean
}

export default function ContactMe() {
    const { theme, setTheme } = useTheme()
    const [logs, setLogs] = useState<TerminalEntry[]>(() => createBaseLogs())
    const [commandInput, setCommandInput] = useState('')
    const [commandHistory, setCommandHistory] = useState<string[]>([])
    const [historyIndex, setHistoryIndex] = useState<number | null>(null)
    const [isComposeMode, setIsComposeMode] = useState(false)
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [networkDiagnostics, setNetworkDiagnostics] = useState<NetworkDiagnostics>({
        latency: null,
        downlink: null,
        status: 'Idle',
        lastChecked: null,
        isChecking: false
    })
    const terminalRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTo({
                top: terminalRef.current.scrollHeight,
                behavior: 'smooth'
            })
        }
    }, [logs, isComposeMode])

    const appendLog = useCallback((entry: TerminalEntryInput) => {
        const enriched: TerminalEntry = {
            ...entry,
            id: `log-${Date.now()}-${Math.random().toString(36).slice(2)}`
        }
        setLogs((prev) => {
            const next = [...prev, enriched]
            if (next.length > MAX_TERMINAL_LOGS) {
                return next.slice(next.length - MAX_TERMINAL_LOGS)
            }
            return next
        })
    }, [])

    const addResponse = useCallback(
        (content: string | string[]) => appendLog({ variant: 'response', content }),
        [appendLog]
    )

    const addStatus = useCallback(
        (label: string, value: string) => appendLog({ variant: 'status', label, value }),
        [appendLog]
    )

    const handleCommand = (rawCommand: string) => {
        const normalized = rawCommand.trim().toLowerCase()
        appendLog({ variant: 'command', content: `guest@eric:~$ ${rawCommand}` })

        if (!normalized) {
            return
        }

        const [baseCommand, ...args] = normalized.split(/\s+/)

        switch (baseCommand) {
            case 'help': {
                const lines = [
                    'Available commands:',
                    ...Object.entries(commandDictionary).map(
                        ([cmd, desc]) => `  ${cmd.padEnd(10)} – ${desc}`
                    )
                ]
                addResponse(lines)
                break
            }
            case 'links': {
                addResponse([
                    'External channels:',
                    '  LinkedIn → https://www.linkedin.com/in/guocheng-song-728580318/',
                    '  GitHub   → https://github.com/feichai0017',
                    '  Email    → Ericsgc@outlook.com'
                ])
                break
            }
            case 'compose': {
                if (isComposeMode) {
                    addResponse('Compose buffer active. Use "exit" to close it.')
                } else {
                    setIsComposeMode(true)
                    addResponse('Compose buffer unlocked. Fill the form to send.')
                }
                break
            }
            case 'exit': {
                if (isComposeMode) {
                    setIsComposeMode(false)
                    addResponse('Compose buffer closed. Standing by for commands.')
                } else {
                    addResponse('Compose buffer is inactive. Nothing to close.')
                }
                break
            }
            case 'status': {
                addStatus('Channel', 'Encrypted ✅')
                addStatus('Latency', '42 ms')
                addStatus('Mode', isComposeMode ? 'Compose' : 'Command')
                break
            }
            case 'coffee': {
                handleBuyMeACoffee()
                addResponse('Routing to Buy Me a Coffee console...')
                break
            }
            case 'clear': {
                setLogs(createBaseLogs())
                setIsComposeMode(false)
                break
            }
            case 'theme': {
                const desired = args[0]
                if (!desired) {
                    addResponse('Usage: theme <light|dark|system>')
                    break
                }
                if (!['light', 'dark', 'system'].includes(desired)) {
                    addResponse(`Unsupported theme "${desired}". Try light | dark | system.`)
                    break
                }
                setTheme(desired as 'light' | 'dark' | 'system')
                addStatus('Theme', `Switched to ${desired}`)
                break
            }
            default: {
                addResponse(`Unknown command "${baseCommand}". Type "help" to inspect options.`)
                break
            }
        }
    }

    const handleCommandSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!commandInput.trim()) return
        handleCommand(commandInput)
        setCommandHistory((prev) => [...prev.slice(-19), commandInput])
        setHistoryIndex(null)
        setCommandInput('')
    }

    const handleCommandInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (commandHistory.length === 0) return
        if (e.key === 'ArrowUp') {
            e.preventDefault()
            setHistoryIndex((prev) => {
                const nextIndex = prev === null ? commandHistory.length - 1 : Math.max(prev - 1, 0)
                setCommandInput(commandHistory[nextIndex] || '')
                return nextIndex
            })
        } else if (e.key === 'ArrowDown') {
            e.preventDefault()
            setHistoryIndex((prev) => {
                if (prev === null) return null
                const nextIndex = prev + 1
                if (nextIndex >= commandHistory.length) {
                    setCommandInput('')
                    return null
                }
                setCommandInput(commandHistory[nextIndex] || '')
                return nextIndex
            })
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        addResponse('Transmitting payload via EmailJS...')
        try {
            await emailjs.send(
                process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
                process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
                {
                    from_email: email,
                    message: message
                },
                process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
            )

            toast.success('Message sent successfully!')
            addStatus('Transmission', 'Delivered ✅')
            setEmail('')
            setMessage('')
            setIsComposeMode(false)
        } catch (error) {
            console.error('Error:', error)
            toast.error('Failed to send message')
            addStatus('Transmission', 'Failed ❌')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleBuyMeACoffee = () => {
        window.open('https://buymeacoffee.com/eric.sgc', '_blank')
    }

    const runNetworkDiagnostics = useCallback(async () => {
        setNetworkDiagnostics((prev) => ({
            ...prev,
            status: 'Testing',
            isChecking: true
        }))

        const start = performance.now()
        try {
            const response = await fetch('/api/ping', { cache: 'no-store' })
            if (!response.ok) throw new Error('Ping failed')
            await response.json()
            const latency = Math.round(performance.now() - start)

            let measuredDownlink: number | null = null
            try {
                const bandwidthStart = performance.now()
                const bandwidthResponse = await fetch('/api/bandwidth', { cache: 'no-store' })
                if (!bandwidthResponse.ok) {
                    throw new Error('Bandwidth test failed')
                }
                const buffer = await bandwidthResponse.arrayBuffer()
                const durationSeconds = (performance.now() - bandwidthStart) / 1000
                const bytes = buffer.byteLength
                if (durationSeconds > 0 && bytes > 0) {
                    measuredDownlink = (bytes * 8) / (durationSeconds * 1_000_000)
                }
            } catch (bandwidthError) {
                console.error('Bandwidth measurement failed', bandwidthError)
            }

            let connectionDownlink: number | null = null
            if (typeof navigator !== 'undefined') {
                const navConnection = (navigator as Navigator & { connection?: { downlink?: number } }).connection
                connectionDownlink = navConnection?.downlink ?? null
            }

            setNetworkDiagnostics({
                latency,
                downlink: measuredDownlink ?? connectionDownlink,
                status: 'OK',
                lastChecked: new Date().toLocaleTimeString(),
                isChecking: false
            })
            addStatus('Diagnostics', `Latency ${latency} ms`)
        } catch (error) {
            console.error('Network diagnostics failed', error)
            setNetworkDiagnostics((prev) => ({
                ...prev,
                status: 'Error',
                isChecking: false
            }))
            addStatus('Diagnostics', 'Unavailable')
        }
    }, [addStatus])

    useEffect(() => {
        runNetworkDiagnostics().catch((err) => console.error(err))
    }, [runNetworkDiagnostics])

    const accentBorder = theme === 'dark' ? 'border-white/10' : 'border-morandi-accent/20'
    const terminalBg = theme === 'dark' ? 'bg-black/60' : 'bg-[#0f0f17]/90'

    return (
        <section
            id="contact"
            className="relative min-h-screen w-full overflow-hidden bg-morandi-bg dark:bg-[#03040a] py-20 px-4 transition-colors duration-500"
        >
            <div className="pointer-events-none absolute inset-0 opacity-0 dark:opacity-30 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_55%)] mix-blend-screen" />
            <div className="pointer-events-none absolute inset-0 opacity-0 dark:opacity-40 bg-[linear-gradient(120deg,_rgba(255,255,255,0.04)_0%,_transparent_35%,_transparent_70%,_rgba(255,255,255,0.03)_100%)]" />
            <div className="pointer-events-none absolute inset-0 opacity-0 dark:opacity-80 bg-[radial-gradient(circle_at_bottom,_rgba(3,4,10,0.85),_rgba(3,4,10,0.95))]" />

            <div className="relative z-10 max-w-6xl mx-auto grid gap-6 lg:grid-cols-[2fr_1fr] lg:items-stretch">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className={`rounded-3xl border ${accentBorder} ${terminalBg} backdrop-blur-3xl shadow-[0_25px_80px_rgba(0,0,0,0.45)] flex flex-col h-[640px] lg:h-[720px] overflow-hidden`}
                >
                    <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
                        <div className="flex items-center gap-3">
                            <span className="flex gap-2">
                                <span className="h-3 w-3 rounded-full bg-red-500" />
                                <span className="h-3 w-3 rounded-full bg-yellow-500" />
                                <span className="h-3 w-3 rounded-full bg-emerald-500" />
                            </span>
                            <p className="text-sm font-mono uppercase tracking-[0.3em] text-morandi-light/70">contact.sh</p>
                        </div>
                        <p className="text-xs font-mono text-morandi-light/60">MORANDI OS TERMINAL</p>
                    </div>

                    <div className="flex flex-1 flex-col px-6 pt-4 pb-4 h-full min-h-0">
                        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
                            <div ref={terminalRef} className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                                {logs.map((entry) => (
                                    <motion.div
                                        key={entry.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="font-mono text-sm"
                                    >
                                        {entry.variant === 'command' && (
                                            <p className="text-emerald-300">{entry.content as string}</p>
                                        )}
                                        {entry.variant === 'response' && (
                                            Array.isArray(entry.content) ? (
                                                <div className="space-y-1 text-morandi-light/80">
                                                    {(entry.content as string[]).map((line, idx) => (
                                                        <p key={idx}>{line}</p>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-morandi-light/80">{entry.content as string}</p>
                                            )
                                        )}
                                        {entry.variant === 'status' && 'label' in entry && 'value' in entry && (
                                            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-morandi-light/70">
                                                <span className="text-morandi-accent">{entry.label}</span>
                                                <span className="text-morandi-light/80">{entry.value}</span>
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>

                            {isComposeMode && (
                                <motion.form
                                    layout
                                    onSubmit={handleSubmit}
                                    className="mt-4 grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl"
                                >
                                    <p className="font-mono text-xs uppercase tracking-[0.3em] text-morandi-light/70">
                                        compose mode — encrypted payload
                                    </p>
                                    <Input
                                        type="email"
                                        placeholder="sender@domain.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="bg-black/30 border-white/10 text-morandi-light placeholder:text-morandi-light/40"
                                    />
                                    <Textarea
                                        placeholder="Type your message"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        required
                                        className="bg-black/30 border-white/10 text-morandi-light placeholder:text-morandi-light/40"
                                    />
                                    <div className="flex flex-wrap gap-3">
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex-1 bg-morandi-accent text-white hover:bg-morandi-accent/80"
                                        >
                                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                                            {isSubmitting ? 'Transmitting...' : 'Send packet'}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setIsComposeMode(false)}
                                            className="border-morandi-accent/30 text-morandi-light hover:bg-morandi-accent/10"
                                        >
                                            Abort
                                        </Button>
                                    </div>
                                </motion.form>
                            )}
                        </div>

                        <form onSubmit={handleCommandSubmit} className="mt-auto border-t border-white/5 pt-4">
                            <label className="font-mono text-xs uppercase tracking-[0.3em] text-morandi-light/60">
                                guest@eric:~/portfolio
                            </label>
                            <div className="mt-2 flex items-center gap-3">
                                <span className="text-morandi-accent font-bold">&gt;</span>
                                <input
                                    value={commandInput}
                                    onChange={(e) => setCommandInput(e.target.value)}
                                    onKeyDown={handleCommandInputKeyDown}
                                    placeholder="Type a command (try `help`)"
                                    className="flex-1 border-b border-morandi-accent/40 bg-transparent pb-1 font-mono text-sm text-morandi-light focus:outline-none"
                                />
                                <Button
                                    type="submit"
                                    className="bg-morandi-accent text-white hover:bg-morandi-accent/80"
                                >
                                    Execute
                                </Button>
                            </div>
                        </form>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="space-y-6 flex flex-col h-[640px] lg:h-[720px] lg:pr-2"
                >
                    <div className={`rounded-3xl border ${accentBorder} ${terminalBg} p-6 backdrop-blur-3xl flex-1 flex flex-col`}>
                        <div className="flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-morandi-light/70">
                            <Wifi className="h-4 w-4 text-emerald-400" />
                            Signal Monitor
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-4 text-sm font-mono text-morandi-light/80">
                            <div>
                                <p className="text-morandi-light/50">Latency</p>
                                <p className="text-morandi-accent text-lg">
                                    {networkDiagnostics.latency !== null ? `${networkDiagnostics.latency} ms` : '--'}
                                </p>
                            </div>
                            <div>
                                <p className="text-morandi-light/50">Bandwidth</p>
                                <p className="text-morandi-accent text-lg">
                                    {networkDiagnostics.downlink !== null ? `${networkDiagnostics.downlink.toFixed(1)} Mbps` : '--'}
                                </p>
                            </div>
                            <div>
                                <p className="text-morandi-light/50">Status</p>
                                <p className="text-morandi-light">{networkDiagnostics.status}</p>
                            </div>
                            <div>
                                <p className="text-morandi-light/50">Last check</p>
                                <p className="text-morandi-light">{networkDiagnostics.lastChecked ?? '--'}</p>
                            </div>
                            <div>
                                <p className="text-morandi-light/50">Mode</p>
                                <p className="text-morandi-light">{isComposeMode ? 'Compose' : 'Command'}</p>
                            </div>
                            <div>
                                <p className="text-morandi-light/50">Channel</p>
                                <p className="text-emerald-400">Encrypted</p>
                            </div>
                        </div>
                        <div className="mt-6 flex flex-col gap-3">
                            <Button
                                onClick={runNetworkDiagnostics}
                                disabled={networkDiagnostics.isChecking}
                                className="w-full bg-morandi-accent text-white hover:bg-morandi-accent/80"
                            >
                                {networkDiagnostics.isChecking ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Testing...
                                    </>
                                ) : (
                                    'Run diagnostics'
                                )}
                            </Button>
                            <Button
                                onClick={handleBuyMeACoffee}
                                className="w-full bg-yellow-500 text-black hover:bg-yellow-400"
                            >
                                <Coffee className="mr-2 h-4 w-4" />
                                Buy Me a Coffee
                            </Button>
                        </div>
                    </div>

                    <div className={`rounded-3xl border ${accentBorder} ${terminalBg} p-6 backdrop-blur-3xl`}>
                        <div className="flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-morandi-light/70">
                            <Command className="h-4 w-4 text-morandi-accent" />
                            Command Reference
                        </div>
                        <div className="mt-4 space-y-3 font-mono text-sm text-morandi-light/80">
                            {Object.entries(commandDictionary).map(([cmd, desc]) => (
                                <div key={cmd} className="flex items-center justify-between">
                                    <span className="text-morandi-accent">{cmd}</span>
                                    <span className="text-right text-morandi-light/60">{desc}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                </motion.div>
            </div>
        </section>
    )
}
