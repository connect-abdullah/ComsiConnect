import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { chatbot } from '../api/api';
import ReactMarkdown from 'react-markdown';

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
  
    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
  
    try {
      const response = await chatbot(input);
  
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }
  
      // Prepare to read the streamed response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let botReply = "";
  
      // Add an empty bot message first to update progressively
      setMessages(prev => [...prev, { sender: "bot", text: "" }]);
      let botMessageIndex = newMessages.length;
  
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunk = decoder.decode(value || new Uint8Array(), { stream: !done });
        botReply += chunk;
  
        // Update the last bot message with the new text chunk
        setMessages(prev => {
          const copy = [...prev];
          copy[botMessageIndex] = { sender: "bot", text: botReply };
          return copy;
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [...prev, { sender: "bot", text: "Sorry, something went wrong." }]);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <Navbar />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center">ComsiConnect Buddy</h2>
            <motion.span
              animate={{ rotate: [0, 20, -20, 0] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
              className="text-3xl sm:text-4xl"
            >
              🤖
            </motion.span>
          </div>

          <div className="bg-zinc-800/50 rounded-2xl border border-zinc-700 p-4 sm:p-6 shadow-2xl backdrop-blur-sm">
            <div className="space-y-4 h-[60vh] overflow-y-auto mb-6 px-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
              {messages.length === 0 && (
                <div className="text-center text-zinc-500 mt-8">
                  <p>No messages yet. Start a conversation!</p>
                  <p className="text-sm mt-2">Try asking about courses, campus life, or academic policies.</p>
                </div>
              )}
              
              {messages.map((msg, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div 
                    className={`max-w-[85%] sm:max-w-[70%] break-words ${
                      msg.sender === "user" 
                        ? "bg-indigo-600 text-white" 
                        : "bg-zinc-700/80"
                    } px-4 py-3 rounded-2xl shadow-lg`}
                  >
                    {msg.sender === "user" ? (
                      <p className="text-sm md:text-base whitespace-pre-wrap break-words">{msg.text}</p>
                    ) : (
                      <div className="text-sm md:text-base prose prose-invert max-w-none break-words">
                        <ReactMarkdown
                          components={{
                            a: ({node, ...props}) => (
                              <a {...props} className="text-blue-400 hover:text-blue-300 break-words" />
                            ),
                            h1: ({node, ...props}) => (
                              <h1 {...props} className="text-red-500 text-2xl font-bold break-words" />
                            ),
                            h2: ({node, ...props}) => (
                              <h2 {...props} className="text-red-500 text-xl font-bold break-words" />
                            ),
                            h3: ({node, ...props}) => (
                              <h3 {...props} className="text-[#f4a848] text-lg font-bold break-words" />
                            ),
                            code: ({node, ...props}) => (
                              <code {...props} className="text-white bg-zinc-700 p-1 break-words" />
                            )
                          }}
                        >
                          {msg.text}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-zinc-700/80 px-4 py-3 rounded-2xl">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce" style={{animationDelay: "0.2s"}}></div>
                      <div className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce" style={{animationDelay: "0.4s"}}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && sendMessage()}
                className="flex-1 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-200"
                placeholder="Ask me..."
                disabled={isLoading}
              />
              <button 
                onClick={sendMessage}
                disabled={isLoading} 
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed rounded-xl transition duration-200 font-medium flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Waiting For Reply...</span>
                  </>
                ) : (
                  <span>Send</span>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
