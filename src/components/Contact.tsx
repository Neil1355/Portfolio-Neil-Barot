import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const Contact = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    await navigator.clipboard.writeText("neil.barot.jobspace@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
            Let's Talk
          </h2>
          <p className="text-muted-foreground mb-10">
            Actively looking for Summer 2026 opportunities. If you're hiring — or just want to connect — reach out.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="grid sm:grid-cols-3 gap-4 mb-10"
        >
          <button
            onClick={copyEmail}
            className="bg-card border border-border rounded-lg p-5 hover:border-primary/40 transition-colors text-center group"
          >
            <div className="text-sm font-medium text-foreground mb-1">Email</div>
            <div className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
              {copied ? "Copied!" : "neil.barot.jobspace@gmail.com"}
            </div>
          </button>

          <a
            href="https://linkedin.com/in/neilbarot5"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-card border border-border rounded-lg p-5 hover:border-primary/40 transition-colors text-center"
          >
            <div className="text-sm font-medium text-foreground mb-1">LinkedIn</div>
            <div className="text-xs text-muted-foreground">linkedin.com/in/neilbarot5</div>
          </a>

          <a
            href="https://github.com/Neil1355"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-card border border-border rounded-lg p-5 hover:border-primary/40 transition-colors text-center"
          >
            <div className="text-sm font-medium text-foreground mb-1">GitHub</div>
            <div className="text-xs text-muted-foreground">github.com/Neil1355</div>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
        >
          {/* TODO: Replace href="#" with path to actual PDF resume */}
          <a
            href="#"
            className="inline-block px-8 py-3 bg-primary text-primary-foreground font-medium rounded-md hover:opacity-90 transition-opacity"
          >
            Download Resume
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
