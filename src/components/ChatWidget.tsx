import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";

interface Message {
  role: "user" | "bot";
  content: string;
}

interface ChatHistoryItem {
  role: string;
  content: string;
}

const suggestedPrompts = [
  "What projects has Neil built?",
  "What's Neil's tech stack?",
  "Is Neil open to internships?",
  "Tell me about the Dunkin forecasting project",
  "What's Neil's background?",
];

/**
 * Sends a chat message and prior chat history to the backend chat API.
 */
const sendMessage = async (message: string, history: ChatHistoryItem[]): Promise<string> => {
  const apiBaseUrl = (import.meta.env.VITE_API_URL ?? "").trim();
  const response = await fetch(`${apiBaseUrl}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, history }),
  });

  if (!response.ok) {
    throw new Error(`Chat request failed with status ${response.status}`);
  }

  const data: { reply?: string } = await response.json();
  if (!data.reply) {
    throw new Error("Chat response did not include a reply");
  }

  return data.reply;
};

const ChatWidget = () => {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const handleSend = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || typing) return;
    setInput("");

    const history: ChatHistoryItem[] = messages.map((message) => ({
      role: message.role === "bot" ? "assistant" : message.role,
      content: message.content,
    }));

    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setTyping(true);

    try {
      const reply = await sendMessage(msg, history);
      setMessages((prev) => [...prev, { role: "bot", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content:
            "Sorry, I ran into an issue reaching the assistant. Please try again in a moment.",
        },
      ]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          ref={sectionRef}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
            Ask Me Anything
          </h2>
          <p className="text-muted-foreground">
            A chatbot trained on everything about me — my projects, skills, and background. Ask it anything a recruiter might want to know.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-card border border-border rounded-lg overflow-hidden"
        >
          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-3 font-body text-sm">
            {messages.length === 0 && !typing && (
              <p className="text-muted-foreground text-center mt-12">
                Start a conversation…
              </p>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-lg ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-secondary text-secondary-foreground px-3 py-2 rounded-lg flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-2 h-2 bg-muted-foreground rounded-full inline-block"
                      style={{
                        animation: `bounce-dot 1.4s ${i * 0.2}s infinite ease-in-out both`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggested prompts */}
          {messages.length === 0 && (
            <div className="px-4 pb-3 flex flex-wrap gap-2">
              {suggestedPrompts.map((p) => (
                <button
                  key={p}
                  onClick={() => handleSend(p)}
                  className="text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="border-t border-border p-3 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about Neil…"
              className="flex-1 bg-secondary text-foreground text-sm rounded-md px-3 py-2 placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary"
              aria-label="Chat message input"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || typing}
              className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-md hover:opacity-90 disabled:opacity-40 transition-opacity"
              aria-label="Send message"
            >
              Send
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ChatWidget;
