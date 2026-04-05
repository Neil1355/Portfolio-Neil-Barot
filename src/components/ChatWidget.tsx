import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";

interface Message {
  role: "user" | "bot";
  content: string;
}

const suggestedPrompts = [
  "What projects has Neil built?",
  "What's Neil's tech stack?",
  "Is Neil open to internships?",
  "Tell me about the Dunkin forecasting project",
  "What's Neil's background?",
];

// TODO: Wire to backend chat endpoint
// POST /api/chat
// Body: { message: string, history: { role: string, content: string }[] }
// Response: { reply: string }
// Replace the placeholder response below with the actual API call
const sendMessage = async (_message: string): Promise<string> => {
  // PLACEHOLDER — remove when backend is connected
  await new Promise((r) => setTimeout(r, 1500));
  return "This is a placeholder response. Wire up the Claude API in the backend.";
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
    if (!msg) return;
    setInput("");

    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setTyping(true);

    const reply = await sendMessage(msg);
    setTyping(false);
    setMessages((prev) => [...prev, { role: "bot", content: reply }]);
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
              disabled={!input.trim()}
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
