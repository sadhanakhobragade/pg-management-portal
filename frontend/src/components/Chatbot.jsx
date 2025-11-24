// frontend/src/components/Chatbot.jsx

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Send, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils'; // Assuming cn utility is used for styling
import api from '@/api/api';

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi there! I am your PG Assistant. How can I help you today?", sender: 'ai' }
    ]);
    const [input, setInput] = useState('');

    const toggleChat = () => setIsOpen(!isOpen);

    const handleSend = async(e) => {
        e.preventDefault();
        if (input.trim() === '') return;

        const newUserMessage = { id: Date.now(), text: input, sender: 'user' };
        
        // 1. Add user message
        setMessages(prev => [...prev, newUserMessage]);
        
        // 2. Clear input
        setInput('');

         try {
        // 3. Call the actual backend API
        const res = await api.post('/portal/chat', { message: input });
        
        // 4. Add the AI's response
        setMessages(prev => [...prev, { 
            id: Date.now() + 1, 
            text: res.data.text, // Use the text returned by the backend
            sender: 'ai' 
        }]);

    } catch (error) {
        // Handle server/network errors
        setMessages(prev => [...prev, { 
            id: Date.now() + 1, 
            text: "Sorry, I am unable to connect to the assistant service right now.", 
            sender: 'ai' 
        }]);
        console.error("Chat API Error:", error);
    }
    };

    return (
        <>
            {/* Floating Chat Button */}
            <Button
                onClick={toggleChat}
                className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-xl bg-gradient-secondary hover:bg-secondary-glow z-[1000]"
                aria-label="Toggle Chatbot"
            >
                {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
            </Button>

            {/* Chat Window Dialog */}
            {isOpen && (
                <Card className="fixed bottom-24 right-6 w-80 h-96 shadow-2xl z-[999] flex flex-col">
                    <CardHeader className="bg-primary text-primary-foreground p-3 flex flex-row items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <MessageCircle className="h-4 w-4" /> PG Assistant
                        </CardTitle>
                        <Button variant="ghost" size="icon" onClick={toggleChat} className="h-6 w-6 text-primary-foreground/80 hover:bg-primary/80">
                            <X className="h-4 w-4" />
                        </Button>
                    </CardHeader>

                    <CardContent className="flex-1 overflow-hidden p-3">
                        <ScrollArea className="h-full pr-3">
                            <div className="space-y-3">
                                {messages.map(msg => (
                                    <div 
                                        key={msg.id} 
                                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={cn(
                                            "max-w-[80%] rounded-xl p-3 text-sm shadow",
                                            msg.sender === 'user' 
                                                ? 'bg-primary text-white rounded-br-none' 
                                                : 'bg-muted text-foreground rounded-bl-none'
                                        )}>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>

                    <CardFooter className="p-3 border-t">
                        <form onSubmit={handleSend} className="flex w-full gap-2">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask me anything..."
                                className="flex-1"
                            />
                            <Button type="submit" size="icon" disabled={input.trim() === ''}>
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </CardFooter>
                </Card>
            )}
        </>
    );
}