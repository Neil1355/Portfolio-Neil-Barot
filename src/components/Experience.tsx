import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const entries = [
  {
    role: "Product Data Research Intern",
    company: "H15DEN",
    location: "Long Beach, CA",
    date: "Mid-2025 – Jan 2026",
    bullets: [
      "Structured 300+ data points across cities; cut pipeline inconsistencies by 40%",
      "Improved lead-processing logic, boosting workflow efficiency by 30%",
    ],
  },
  {
    role: "Barista",
    company: "Dunkin'",
    location: "New Brunswick, NJ",
    date: "Nov 2025 – Present",
    bullets: [
      "Serves 150–250 customers/shift; inspired and validated the Dunkin Demand Intelligence platform",
    ],
  },
  {
    role: "Store Associate + Pharmacy Technician",
    company: "Walgreens",
    location: "NJ",
    date: "Feb 2025 – Sept 2025",
    bullets: [
      "Processed prescriptions and resolved discrepancies with 99% accuracy across 300–400 daily interactions",
    ],
  },
];

const Experience = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="experience" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-12"
        >
          Experience
        </motion.h2>

        <div className="relative border-l border-border ml-4">
          {entries.map((entry, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.15 }}
              className="relative pl-8 pb-10 last:pb-0"
            >
              {/* Dot */}
              <div className="absolute left-0 top-1.5 w-3 h-3 -translate-x-[7px] rounded-full bg-primary border-2 border-background" />

              <div className="text-xs text-muted-foreground mb-1">{entry.date}</div>
              <h3 className="font-heading text-base font-bold text-foreground">
                {entry.role}
              </h3>
              <div className="text-sm text-muted-foreground mb-2">
                {entry.company} · {entry.location}
              </div>
              <ul className="space-y-1">
                {entry.bullets.map((b, bi) => (
                  <li key={bi} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-0.5">▸</span> {b}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 ml-4">
          <a
            href="https://linkedin.com/in/neilbarot5"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Full history on LinkedIn →
          </a>
        </div>
      </div>
    </section>
  );
};

export default Experience;
