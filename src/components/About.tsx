import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  { label: "Projects Built", value: "4" },
  { label: "CS @ Rutgers", value: "'27" },
  { label: "Open to", value: "Internships" },
];

const About = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-12"
        >
          About Me
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Photo placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="aspect-square max-w-sm mx-auto md:mx-0 rounded-xl bg-card border border-border flex items-center justify-center relative overflow-hidden"
          >
            {/* TODO: Replace src with actual photo path */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
            <span className="font-heading text-6xl text-primary/30">NB</span>
            <div className="absolute inset-0 rounded-xl ring-1 ring-primary/20" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-5 text-muted-foreground leading-relaxed"
          >
            <p>
              I work at Dunkin'. I also built a full-stack ML forecasting platform for Dunkin'. That's basically my whole personality — I see a system, I want to fix it, and I don't wait for someone to assign me a ticket.
            </p>
            <p>
              I'm a junior at Rutgers studying Computer Science with a minor in Cognitive Science. That combination isn't accidental. I care about how people think and how systems fail — and I build tools that sit at that intersection. From demand forecasting engines to attention detection AI, everything I build touches real human behavior.
            </p>
            <p>
              I'm actively looking for Summer 2026 internships in SWE or ML. I bring full-stack range (React, Flask, PostgreSQL), ML experience (scikit-learn, OpenCV, NLP), and the ability to ship end-to-end — from architecture to deployment.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-3 gap-4 mt-12 max-w-lg"
        >
          {stats.map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-lg p-4 text-center">
              <div className="font-heading text-xl font-bold text-primary">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default About;
