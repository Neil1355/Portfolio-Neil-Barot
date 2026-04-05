import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface Project {
  title: string;
  badge: string;
  badgeColor: string;
  featured?: boolean;
  problem: string;
  tech: string[];
  metrics?: string[];
  github: string;
  demo?: string;
}

const projects: Project[] = [
  {
    title: "Dunkin Demand Intelligence",
    badge: "Featured Project",
    badgeColor: "bg-primary/15 text-primary",
    featured: true,
    problem:
      "Full-stack ML forecasting platform built for real Dunkin' operations — predicts demand, adjusts for context, and learns over time.",
    tech: ["Python", "Flask", "PostgreSQL", "React", "TypeScript", "scikit-learn", "JWT", "Vite"],
    metrics: [
      "95%+ forecast accuracy across 1,000+ daily data points",
      "100–300ms latency reduction via connection pooling",
      "6 data input methods (manual, Excel, QR, API, batch)",
      "3-role access control + 15+ audit log types",
    ],
    github: "https://github.com/Neil1355/Dunkin-Demand-Intelligence",
    demo: "https://dunkin-demand-intelligence-neil-barots-projects-55b3b305.vercel.app",
  },
  {
    title: "Resume Tailor Pro",
    badge: "Live",
    badgeColor: "bg-primary/15 text-primary",
    featured: true,
    problem:
      "Full-stack AI resume tailoring app that rewrites bullet points against a job description while preserving strict DOCX/PDF layout fidelity.",
    tech: ["React", "TypeScript", "Vite", "FastAPI", "Python", "Gemini", "docxtpl", "Docker"],
    metrics: [
      "End-to-end workflow: analyze JD, tailor bullets, preview changes, export documents",
      "Layout-safe generation via placeholder-based DOCX templating",
      "Security hardening: endpoint rate limiting, CORS controls, and dependency audits",
    ],
    github: "https://github.com/Neil1355/resume-tailor-pro",
    demo: "https://resume-tailor-pro-lilac.vercel.app/",
  },
  {
    title: "FocusSight AI",
    badge: "In Development",
    badgeColor: "bg-secondary text-secondary-foreground",
    problem:
      "Computer vision tool that detects when a user has zoned out while studying and triggers a re-engagement alert.",
    tech: ["Python", "OpenCV", "MediaPipe", "ML", "React"],
    github: "#", // TODO: Replace with actual FocusSight AI repo URL once available
  },
  {
    title: "ProMetric",
    badge: "Completed",
    badgeColor: "bg-secondary text-secondary-foreground",
    problem:
      "Desktop tutoring management system for 30+ students and tutors — automates scheduling, feedback, and progress reporting.",
    tech: ["Python", "Tkinter", "MySQL"],
    metrics: [
      "~40% reduction in manual tracking time",
      "~50% improvement in data reporting efficiency",
      "Multi-role dashboards: student, tutor, manager",
    ],
    github: "https://github.com/Neil1355/Prometric",
  },
];

const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className={`bg-card border border-border rounded-lg p-6 hover:border-primary/40 transition-colors ${project.featured ? "md:col-span-2" : ""}`}
    >
      <div className="flex items-center gap-3 mb-3">
        <h3 className="font-heading text-lg font-bold text-foreground">{project.title}</h3>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${project.badgeColor}`}>
          {project.badge}
        </span>
      </div>

      <p className="text-muted-foreground text-sm mb-4">{project.problem}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {project.tech.map((t) => (
          <span key={t} className="text-xs px-2 py-1 rounded bg-secondary text-secondary-foreground">
            {t}
          </span>
        ))}
      </div>

      {project.metrics && (
        <ul className="text-sm text-muted-foreground mb-4 space-y-1">
          {project.metrics.map((m) => (
            <li key={m} className="flex items-start gap-2">
              <span className="text-primary mt-1">▸</span> {m}
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-3">
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline"
        >
          GitHub →
        </a>
        {project.demo && (
          // TODO: Replace live demo href with production URL once custom domain is set
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline"
          >
            Live Demo →
          </a>
        )}
      </div>
    </motion.div>
  );
};

const Projects = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="projects" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
            Things I've Built
          </h2>
          <p className="text-muted-foreground">Real systems. Real problems. Shipped and deployed.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((p, i) => (
            <ProjectCard key={p.title} project={p} index={i} />
          ))}
        </div>

        <div className="mt-8 text-center">
          <a
            href="https://github.com/Neil1355"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            More on GitHub →
          </a>
        </div>
      </div>
    </section>
  );
};

export default Projects;
