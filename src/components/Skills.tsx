import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const groups = [
  {
    label: "Languages",
    items: ["Python", "Java", "TypeScript", "SQL", "HTML/CSS"],
  },
  {
    label: "Frameworks & Libraries",
    items: ["Flask", "React", "scikit-learn", "NLTK", "spaCy", "Hugging Face Transformers", "Tkinter", "Vite"],
  },
  {
    label: "Databases & Tools",
    items: ["PostgreSQL", "MySQL", "Git/GitHub", "VS Code", "Google Cloud", "Vercel"],
  },
  {
    label: "Backend & Security",
    items: ["JWT Auth", "bcrypt", "REST APIs", "Connection Pooling", "Rate Limiting", "Database Optimization"],
  },
];

const Skills = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="skills" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-12"
        >
          Tech Stack
        </motion.h2>

        <div className="space-y-8">
          {groups.map((group, gi) => (
            <motion.div
              key={group.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: gi * 0.1 }}
            >
              <h3 className="text-sm text-muted-foreground font-medium mb-3">{group.label}</h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item, ii) => (
                  <motion.span
                    key={item}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.3, delay: gi * 0.1 + ii * 0.05 }}
                    className="text-sm px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20"
                  >
                    {item}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
