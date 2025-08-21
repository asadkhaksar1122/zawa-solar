'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

// Enhanced markdown parser for headings, basic formatting, links, phone numbers, emails, and images
const parseMarkdown = (text: string) => {
    return text
        .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold text-gray-800 mt-4 mb-2">$1</h3>')
        .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold text-gray-800 mt-4 mb-2">$1</h2>')
        .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-gray-800 mt-4 mb-2">$1</h1>')
        .replace(/!\[([^\]]*?)\]\(([^\)]+)\)/g, (match, altText, imagePath) => {
            const cleanPath = imagePath.trim();
            return `<div class="my-3"><img src="${cleanPath}" alt="${altText || 'Team member'}" class="w-20 h-20 rounded-full object-cover border-2 border-gray-200 shadow-sm block" style="display: block !important;" /></div>`;
        })
        .replace(/Image: ([^\s\n]+)/g, (match, imagePath) => {
            const cleanPath = imagePath.trim();
            return `<div class="my-3"><img src="${cleanPath}" alt="Team member" class="w-20 h-20 rounded-full object-cover border-2 border-gray-200 shadow-sm block" style="display: block !important;" /></div>`;
        })
        .replace(/(\+\d{12,15})/g, '<span class="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded font-mono text-sm">$1 <span class="text-green-600 hover:text-green-800 transition-colors cursor-pointer copy-btn" data-copy="$1" title="Copy number">📋</span></span>')
        .replace(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, '<span class="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded font-mono text-sm">$1 <span class="text-blue-600 hover:text-blue-800 transition-colors cursor-pointer copy-btn" data-copy="$1" title="Copy email">📋</span></span>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');
};

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: 'Hello! Welcome to Zawa Solar Energy. I can help you with:\n• Product information (solar panels, specifications)\n• Contact details (WhatsApp, email, phone)\n• Company information\n• Office location\n• Team information\n\nWhat would you like to know?',
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [copySuccess, setCopySuccess] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Function to handle copying text to clipboard
    const handleCopy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopySuccess(text);
            setTimeout(() => setCopySuccess(null), 2000); // Hide after 2 seconds
            console.log('Copied to clipboard:', text);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopySuccess(text);
            setTimeout(() => setCopySuccess(null), 2000);
        }
    };

    // Add event listeners for copy buttons after messages update
    useEffect(() => {
        const copyButtons = document.querySelectorAll('.copy-btn');
        copyButtons.forEach(button => {
            const handleClick = () => {
                const textToCopy = button.getAttribute('data-copy');
                if (textToCopy) {
                    handleCopy(textToCopy);
                }
            };
            button.addEventListener('click', handleClick);

            // Cleanup function to remove event listener
            return () => button.removeEventListener('click', handleClick);
        });
    }, [messages]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen) {
            setIsAnimating(true);
            scrollToBottom();
        }
    }, [isOpen]);

    const [abortController, setAbortController] = useState<AbortController | null>(null);

    const handleToggleChat = () => {
        if (isOpen) {
            setIsAnimating(false);
            setTimeout(() => {
                setIsOpen(false);
                setIsVisible(false);
            }, 300);
        } else {
            setIsOpen(true);
            setIsVisible(true);
            setIsAnimating(true);
        }
    };

    const sendMessage = async (messageText?: string) => {
        const messageToSend = messageText || input;
        if (!messageToSend.trim() || isLoading) return;

        const userMessage: Message = {
            role: 'user',
            content: messageToSend,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        // Create new AbortController for this request
        const controller = new AbortController();
        setAbortController(controller);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: messageToSend }),
                signal: controller.signal
            });

            const data = await response.json();

            const assistantMessage: Message = {
                role: 'assistant',
                content: data.reply || 'Sorry, I couldn\'t process your request.',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
                // Request was aborted
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: 'Request was stopped.',
                    timestamp: new Date()
                }]);
            } else {
                console.error('Error:', error);
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: 'Sorry, I encountered an error. Please try again.',
                    timestamp: new Date()
                }]);
            }
        } finally {
            setIsLoading(false);
            setAbortController(null);
        }
    };

    const stopMessage = () => {
        if (abortController) {
            abortController.abort();
        }
    };

    const quickActions = ['Show all products', 'WhatsApp number', 'Office location'];

    return (
        <>
            <style jsx>{`
                @keyframes expandFromButton {
                    0% {
                        opacity: 0;
                        transform: scale(0.1) translate(120px, 240px);
                        transform-origin: bottom right;
                    }
                    50% {
                        opacity: 0.7;
                        transform: scale(0.8) translate(60px, 120px);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1) translate(0, 0);
                        transform-origin: bottom right;
                    }
                }

                @keyframes collapseToButton {
                    0% {
                        opacity: 1;
                        transform: scale(1) translate(0, 0);
                        transform-origin: bottom right;
                    }
                    50% {
                        opacity: 0.7;
                        transform: scale(0.8) translate(60px, 120px);
                    }
                    100% {
                        opacity: 0;
                        transform: scale(0.1) translate(120px, 240px);
                        transform-origin: bottom right;
                    }
                }

                @keyframes popIn {
                    0% {
                        transform: scale(0) rotate(180deg);
                        opacity: 0;
                    }
                    50% {
                        transform: scale(1.1) rotate(90deg);
                    }
                    100% {
                        transform: scale(1) rotate(0deg);
                        opacity: 1;
                    }
                }

                @keyframes fadeInUp {
                    0% {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes bounceIn {
                    0% {
                        opacity: 0;
                        transform: scale(0.3);
                    }
                    50% {
                        opacity: 1;
                        transform: scale(1.05);
                    }
                    70% {
                        transform: scale(0.9);
                    }
                    100% {
                        transform: scale(1);
                    }
                }

                @keyframes shimmer {
                    0% {
                        background-position: -1000px 0;
                    }
                    100% {
                        background-position: 1000px 0;
                    }
                }

                .animate-expandFromButton {
                    animation: expandFromButton 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
                }

                .animate-collapseToButton {
                    animation: collapseToButton 0.3s cubic-bezier(0.55, 0.055, 0.675, 0.19) forwards;
                }

                .animate-popIn {
                    animation: popIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                }

                .animate-fadeInUp {
                    animation: fadeInUp 0.5s ease-out forwards;
                }

                .animate-fadeInUp-delay-1 {
                    animation: fadeInUp 0.5s ease-out 0.1s forwards;
                    opacity: 0;
                }

                .animate-fadeInUp-delay-2 {
                    animation: fadeInUp 0.5s ease-out 0.2s forwards;
                    opacity: 0;
                }

                .animate-fadeInUp-delay-3 {
                    animation: fadeInUp 0.5s ease-out 0.3s forwards;
                    opacity: 0;
                }

                .animate-bounceIn {
                    animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                }

                .shimmer {
                    background: linear-gradient(
                        90deg,
                        transparent 0%,
                        rgba(255, 255, 255, 0.1) 50%,
                        transparent 100%
                    );
                    background-size: 1000px 100%;
                    animation: shimmer 2s infinite;
                }

                .chat-button-rotate {
                    transition: transform 0.3s ease;
                }

                .chat-button-rotate.active {
                    transform: rotate(90deg) scale(0.9);
                }

                .pulse-ring {
                    animation: pulse-ring 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
                }

                @keyframes pulse-ring {
                    0% {
                        transform: scale(0.95);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(1.4);
                        opacity: 0;
                    }
                }
            `}</style>

            {/* Chat Button */}
            <div className="fixed bottom-0 right-4 mb-4 z-50 group">
                <div className="relative">
                    {/* Pulse ring effect when closed */}
                    {!isOpen && (
                        <div className="absolute inset-0 bg-muted rounded-full pulse-ring"></div>
                    )}
                    <button
                        onClick={handleToggleChat}
                        className={`bg-muted text-foreground rounded-full p-4 shadow-lg hover:bg-muted/80 transition-all duration-300 border relative transform hover:scale-110 ${isOpen ? 'scale-95 bg-muted/60' : 'animate-bounceIn'
                            }`}
                        aria-label="Open chat"
                    >
                        <div className={`relative chat-button-rotate ${isOpen ? 'active' : ''}`}>
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                className="transition-transform"
                            >
                                {isOpen ? (
                                    <path
                                        d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
                                        fill="currentColor"
                                    />
                                ) : (
                                    <path
                                        d="M12 2C6.48 2 2 6.48 2 12C2 13.85 2.5 15.55 3.35 17L2 22L7 20.65C8.45 21.5 10.15 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM8 11H16V13H8V11ZM8 7H16V9H8V7ZM8 15H13V17H8V15Z"
                                        fill="currentColor"
                                    />
                                )}
                            </svg>
                            {!isOpen && (
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                            )}
                        </div>
                    </button>
                </div>
                {/* Hover Tooltip */}
                {!isOpen && (
                    <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                        <div className="bg-foreground text-background px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap shadow-lg animate-popIn">
                            Chat with AI
                            <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-foreground"></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Chat Window */}
            {isVisible && (
                <div className={`fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-8rem)] bg-white rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200 ${isAnimating ? 'animate-expandFromButton' : 'animate-collapseToButton'}`}>
                    {/* Header */}
                    <div className="bg-muted/40 text-foreground p-4 rounded-t-lg flex justify-between items-center border-b animate-fadeInUp shimmer">
                        <div className="flex items-center gap-3">
                            <div className="animate-bounceIn">
                                <Image src="/icon.png" alt="Zawa Solar Energy" width={40} height={40} className="rounded-full" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg animate-fadeInUp-delay-1">Zawa Solar Energy</h3>
                                <p className="text-sm opacity-90 animate-fadeInUp-delay-2">Your Solar Solution Expert</p>
                            </div>
                        </div>
                        <button
                            onClick={handleToggleChat}
                            className="text-muted-foreground hover:bg-muted/20 rounded-full p-2 transition-all hover:rotate-90 duration-300 animate-fadeInUp-delay-3"
                            aria-label="Close chat"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
                                    fill="currentColor"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Copy Success Notification */}
                    {copySuccess && (
                        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-10 animate-fadeInUp">
                            <div className="flex items-center gap-2">
                                <span>✓</span>
                                <span className="text-sm">Copied: {copySuccess}</span>
                            </div>
                        </div>
                    )}

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeInUp`}
                                style={{
                                    opacity: 0,
                                    animation: 'fadeInUp 0.5s ease-out forwards',
                                    animationDelay: `${Math.min(index * 0.1, 0.5)}s`
                                }}
                            >
                                <div
                                    className={`max-w-[80%] p-3 rounded-lg transform transition-all duration-300 hover:scale-[1.02] ${message.role === 'user'
                                        ? 'bg-muted text-foreground rounded-br-none border hover:shadow-md'
                                        : 'bg-background text-foreground shadow-sm rounded-bl-none border hover:shadow-lg'
                                        }`}
                                >
                                    <p
                                        className="text-sm whitespace-pre-wrap"
                                        dangerouslySetInnerHTML={{ __html: parseMarkdown(message.content) }}
                                    />
                                    <p className="text-xs mt-1 opacity-70">
                                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start animate-fadeInUp">
                                <div className="bg-background p-3 rounded-lg shadow-sm border rounded-bl-none">
                                    <div className="flex space-x-2">
                                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Actions */}
                    <div className="px-4 py-3 border-t bg-background animate-fadeInUp-delay-2">
                        <p className="text-xs text-muted-foreground mb-2">Quick questions:</p>
                        <div className="flex flex-wrap gap-2">
                            {quickActions.map((action, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setInput(action);
                                        sendMessage(action);
                                    }}
                                    className="text-xs bg-muted/40 hover:bg-muted/60 text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-full transition-all duration-200 transform hover:scale-105 hover:shadow-md animate-fadeInUp"
                                    style={{
                                        animationDelay: `${0.3 + index * 0.1}s`,
                                        opacity: 0
                                    }}
                                >
                                    {action}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t bg-background rounded-b-lg animate-fadeInUp-delay-3">
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                placeholder="Type your message..."
                                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-muted bg-background transition-all duration-300 focus:shadow-lg"
                                disabled={isLoading}
                            />
                            <button
                                onClick={isLoading ? stopMessage : () => sendMessage()}
                                disabled={!isLoading && !input.trim()}
                                className={`px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${isLoading
                                    ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                                    : 'bg-muted hover:bg-muted/80 text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg'
                                    }`}
                            >
                                {isLoading ? (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="animate-spin">
                                        <rect x="6" y="6" width="12" height="12" fill="currentColor" />
                                    </svg>
                                ) : (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="transform transition-transform hover:translate-x-1">
                                        <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" fill="currentColor" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}