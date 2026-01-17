import { useEffect, useRef, useState } from "react";
import "./index.css";
import resumeData from "../resources/resume.json";
import type { Resume } from "./types/resume";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import {
  Mail,
  Phone,
  Linkedin,
  MapPin,
  Calendar,
  ExternalLink,
  ChevronDown,
  Github,
  Heart,
  GraduationCap,
  Award,
  Briefcase,
  Code2,
  User,
  Star,
  Send,
  Loader2,
  CheckCircle,
  XCircle,
  Download,
} from "lucide-react";

const resume = resumeData as Resume;

// GitHub pinned repositories data
interface GitHubRepo {
  name: string;
  description: string;
  url: string;
  language: string;
  stars: number;
  emoji?: string;
}

const PINNED_REPOS: GitHubRepo[] = [
  {
    name: "mkfd",
    description: "RSS feed builder created with Bun and Hono - builds from webpages, email folders, and REST API calls.",
    url: "https://github.com/tbosak/mkfd",
    language: "TypeScript",
    stars: 0,
    emoji: "🥖🔥",
  },
  {
    name: "ability",
    description: "A browser extension that helps people with varying degrees of ability have more control over their browsing experience.",
    url: "https://github.com/tbosak/ability",
    language: "JavaScript",
    stars: 0,
    emoji: "♿",
  },
  {
    name: "notomato",
    description: "Pomodoro notes app built in Ionic & Angular frameworks, using Dexie.js to persist tasks/notes in IndexedDB.",
    url: "https://github.com/tbosak/notomato",
    language: "TypeScript",
    stars: 0,
    emoji: "🍅📝",
  },
  {
    name: "fornax",
    description: "Build Faster, Code Smarter, With Fornax – The Bun-Powered Full-Stack Web Framework.",
    url: "https://github.com/tbosak/fornax",
    language: "TypeScript",
    stars: 0,
    emoji: "🥖🥞🕸️",
  },
  {
    name: "proteux",
    description: "Visualize CSV & JSON as a table. Hide, sort, modify, & export to CSV, JSON, TXT, or Markdown tables.",
    url: "https://github.com/tbosak/proteux",
    language: "TypeScript",
    stars: 0,
    emoji: "📊",
  },
  {
    name: "specbridge",
    description: "Instantly turn OpenAPI Specs into MCP Tools.",
    url: "https://github.com/tbosak/specbridge",
    language: "TypeScript",
    stars: 0,
    emoji: "🌉",
  },
];

// Language colors for GitHub-style badges
const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  Python: "#3776ab",
  Rust: "#dea584",
  Go: "#00add8",
};

// Format date helper
function formatDate(dateStr: string): string {
  if (!dateStr) return "Present";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

// Format phone helper
function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
}

// Intersection Observer hook for scroll animations
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
}

// Hook to fetch GitHub stars
function useGitHubStars() {
  const [repos, setRepos] = useState<GitHubRepo[]>(PINNED_REPOS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStars() {
      try {
        const updatedRepos = await Promise.all(
          PINNED_REPOS.map(async (repo) => {
            try {
              const response = await fetch(
                `https://api.github.com/repos/tbosak/${repo.name}`,
                { headers: { Accept: "application/vnd.github.v3+json" } }
              );
              if (response.ok) {
                const data = await response.json();
                return { ...repo, stars: data.stargazers_count };
              }
            } catch {
              // Silently fail for individual repos
            }
            return repo;
          })
        );
        setRepos(updatedRepos);
      } finally {
        setLoading(false);
      }
    }
    fetchStars();
  }, []);

  return { repos, loading };
}

// Animated section wrapper
function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, isInView } = useInView(0.1);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className}`}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? "translateY(0)" : "translateY(40px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// Hero Section with headshot
function HeroSection() {
  const [scrollY, setScrollY] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="min-h-screen flex flex-col justify-center relative px-8 md:px-16 lg:px-24 py-20 overflow-hidden">
      {/* Animated background elements */}
      <div
        className="absolute right-8 md:right-16 top-1/4 w-px h-48 bg-gradient-to-b from-terracotta to-transparent opacity-40"
        style={{ transform: `translateY(${scrollY * 0.1}px)` }}
      />
      <div
        className="absolute right-16 md:right-32 top-1/3 w-32 h-px bg-gradient-to-r from-terracotta to-transparent opacity-40"
        style={{ transform: `translateX(${scrollY * 0.05}px)` }}
      />

      {/* Floating decorative shapes */}
      <div
        className="absolute -right-20 top-1/4 w-96 h-96 rounded-full bg-terracotta/5 blur-3xl animate-pulse-slow"
        style={{ transform: `translate(${scrollY * 0.02}px, ${scrollY * -0.03}px)` }}
      />
      <div
        className="absolute -left-32 bottom-1/4 w-64 h-64 rounded-full bg-slate/5 blur-2xl animate-float"
      />

      <div className="max-w-6xl w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        {/* Headshot with editorial framing */}
        <div className="relative opacity-0 animate-scale-in animate-delay-100 order-first lg:order-last flex-shrink-0">
          {/* Decorative frame elements */}
          <div className="absolute -top-4 -left-4 w-24 h-24 border-l-2 border-t-2 border-terracotta opacity-60 transition-all duration-500 group-hover:scale-110" />
          <div className="absolute -bottom-4 -right-4 w-24 h-24 border-r-2 border-b-2 border-terracotta opacity-60 transition-all duration-500 group-hover:scale-110" />

          {/* Image container with hover effects */}
          <div className="relative group">
            <div className={`w-48 h-48 md:w-64 md:h-64 lg:w-72 lg:h-72 overflow-hidden transition-all duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}>
              <img
                src="/resources/headshot.jpg"
                alt="Timothy Barani"
                onLoad={() => setImageLoaded(true)}
                className="w-full h-full object-cover grayscale-[30%] hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
              />
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-terracotta/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Subtle rotating border accent */}
            <div className="absolute inset-0 border border-terracotta/30 pointer-events-none" />
          </div>

          {/* Floating badge */}
          <div className="absolute -bottom-2 -right-2 md:bottom-2 md:right-2 bg-terracotta text-cream px-3 py-1 text-xs tracking-widest uppercase font-body shadow-lg animate-fade-in animate-delay-500">
            Available
          </div>
        </div>

        {/* Text content */}
        <div className="flex-1 text-center lg:text-left">
          {/* Overline */}
          <div className="flex items-center gap-4 mb-8 justify-center lg:justify-start opacity-0 animate-fade-in animate-delay-100">
            <div className="w-12 h-px bg-terracotta" />
            <span className="text-sm tracking-[0.3em] uppercase text-muted-foreground font-body">
              Software Engineer
            </span>
          </div>

          {/* Name with enhanced typography */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-semibold tracking-tight leading-[0.9] mb-8 opacity-0 animate-slide-up animate-delay-200">
            <span className="block relative inline-block">
              Timothy
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-terracotta/20 transform origin-left animate-draw-line animate-delay-400" />
            </span>
            <span className="block text-terracotta relative">
              Barani
              <span className="absolute -right-4 top-0 text-2xl opacity-30 animate-pulse">*</span>
            </span>
          </h1>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-2xl leading-relaxed mb-12 opacity-0 animate-slide-up animate-delay-300 mx-auto lg:mx-0">
            Crafting healthcare technology solutions with a{" "}
            <span className="text-terracotta font-medium relative">
              human-centered
              <span className="absolute bottom-0 left-0 w-full h-px bg-terracotta animate-draw-line animate-delay-600" />
            </span>{" "}
            approach.
          </p>

          {/* Contact row with enhanced hover effects */}
          <div className="flex flex-wrap gap-4 md:gap-6 text-sm opacity-0 animate-fade-in animate-delay-500 justify-center lg:justify-start">
            <a
              href={`mailto:${resume.basics.email}`}
              className="flex items-center gap-2 text-muted-foreground hover:text-terracotta transition-all duration-300 group hover:-translate-y-0.5"
            >
              <span className="relative">
                <Mail className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                <span className="absolute inset-0 bg-terracotta/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-300 opacity-0 group-hover:opacity-100" />
              </span>
              <span className="relative overflow-hidden">
                {resume.basics.email}
                <span className="absolute bottom-0 left-0 w-full h-px bg-terracotta transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
              </span>
            </a>
            <a
              href={`tel:${resume.basics.phone}`}
              className="flex items-center gap-2 text-muted-foreground hover:text-terracotta transition-all duration-300 group hover:-translate-y-0.5"
            >
              <span className="relative">
                <Phone className="w-4 h-4 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
                <span className="absolute inset-0 bg-terracotta/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-300 opacity-0 group-hover:opacity-100" />
              </span>
              <span className="relative overflow-hidden">
                {formatPhone(resume.basics.phone)}
                <span className="absolute bottom-0 left-0 w-full h-px bg-terracotta transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
              </span>
            </a>
            {resume.basics.profiles.map((profile) => (
              <a
                key={profile.network}
                href={profile.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-terracotta transition-all duration-300 group hover:-translate-y-0.5"
              >
                <span className="relative">
                  <Linkedin className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                  <span className="absolute inset-0 bg-terracotta/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-300 opacity-0 group-hover:opacity-100" />
                </span>
                <span className="relative overflow-hidden">
                  {profile.username}
                  <span className="absolute bottom-0 left-0 w-full h-px bg-terracotta transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                </span>
              </a>
            ))}
            <a
              href="https://github.com/tbosak"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground hover:text-terracotta transition-all duration-300 group hover:-translate-y-0.5"
            >
              <span className="relative">
                <Github className="w-4 h-4 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
                <span className="absolute inset-0 bg-terracotta/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-300 opacity-0 group-hover:opacity-100" />
              </span>
              <span className="relative overflow-hidden">
                tbosak
                <span className="absolute bottom-0 left-0 w-full h-px bg-terracotta transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
              </span>
            </a>
          </div>

          {/* Resume download buttons */}
          <div className="mt-8 opacity-0 animate-fade-in animate-delay-600 flex gap-3 justify-center lg:justify-start">
            <a
              href="/resources/timbresume11-3.pdf"
              download="Timothy_Barani_Resume.pdf"
              className="inline-flex items-center gap-2 px-5 py-3 border border-terracotta text-terracotta font-medium hover:bg-terracotta hover:text-cream transition-all duration-300 group"
            >
              <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform duration-300" />
              PDF
            </a>
            <a
              href="/resources/timbresume11-3.docx"
              download="Timothy_Barani_Resume.docx"
              className="inline-flex items-center gap-2 px-5 py-3 border border-terracotta text-terracotta font-medium hover:bg-terracotta hover:text-cream transition-all duration-300 group"
            >
              <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform duration-300" />
              DOCX
            </a>
          </div>
        </div>
      </div>

      {/* Enhanced scroll indicator - hidden on mobile */}
      <div className="hidden md:flex absolute bottom-12 left-1/2 -translate-x-1/2 flex-col items-center gap-2 opacity-0 animate-fade-in animate-delay-800">
        <span className="text-xs tracking-widest uppercase text-muted-foreground">
          Scroll
        </span>
        <div className="relative">
          <ChevronDown className="w-5 h-5 text-terracotta animate-bounce" />
          <ChevronDown className="w-5 h-5 text-terracotta/30 animate-bounce absolute top-1" style={{ animationDelay: '0.1s' }} />
        </div>
      </div>
    </section>
  );
}

// About Section
function AboutSection() {
  return (
    <section className="py-24 px-8 md:px-16 lg:px-24" id="about">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <div className="flex items-center gap-4 mb-8 group">
            <User className="w-5 h-5 text-terracotta group-hover:rotate-12 transition-transform duration-300" />
            <h2 className="text-sm tracking-[0.3em] uppercase text-muted-foreground font-body">
              About
            </h2>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-12 gap-12 items-start">
          <AnimatedSection className="md:col-span-8" delay={100}>
            <p className="text-2xl md:text-3xl font-display leading-relaxed text-balance">
              {resume.basics.summary}
            </p>
          </AnimatedSection>

          <AnimatedSection className="md:col-span-4" delay={200}>
            <div className="space-y-6">
              <div className="p-6 bg-cream-dark/50 border border-border hover:border-terracotta/50 transition-all duration-300 group hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-4 h-4 text-terracotta group-hover:animate-pulse" />
                  <span className="text-sm font-medium">Location</span>
                </div>
                <p className="text-muted-foreground">
                  {resume.basics.location.address}
                </p>
              </div>

              <div className="p-6 bg-cream-dark/50 border border-border hover:border-terracotta/50 transition-all duration-300 group hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <GraduationCap className="w-4 h-4 text-terracotta group-hover:animate-pulse" />
                  <span className="text-sm font-medium">Education</span>
                </div>
                <p className="text-muted-foreground">
                  {resume.education[0].studyType} in {resume.education[0].area}
                </p>
                <p className="text-sm text-slate-light mt-1">
                  {resume.education[0].institution}
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>

        <div className="section-divider my-24" />
      </div>
    </section>
  );
}

// Experience Section with enhanced animations
function ExperienceSection() {
  return (
    <section className="py-24 px-8 md:px-16 lg:px-24" id="experience">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <div className="flex items-center gap-4 mb-16 group">
            <Briefcase className="w-5 h-5 text-terracotta group-hover:rotate-12 transition-transform duration-300" />
            <h2 className="text-sm tracking-[0.3em] uppercase text-muted-foreground font-body">
              Experience
            </h2>
          </div>
        </AnimatedSection>

        <div className="space-y-16">
          {resume.work.map((job, index) => (
            <AnimatedSection key={job.name} delay={index * 100}>
              <article className="grid md:grid-cols-12 gap-8 group relative">
                {/* Hover accent line */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-terracotta transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top" />

                {/* Date column */}
                <div className="md:col-span-3 md:pl-4">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                    <Calendar className="w-4 h-4 group-hover:text-terracotta transition-colors duration-300" />
                    <span>
                      {formatDate(job.startDate)} — {formatDate(job.endDate)}
                    </span>
                  </div>
                  {job.location && (
                    <div className="flex items-center gap-3 text-sm text-slate-light">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                  )}
                </div>

                {/* Content column */}
                <div className="md:col-span-9">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-2xl font-display font-semibold group-hover:text-terracotta transition-colors duration-300">
                        {job.position}
                      </h3>
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-terracotta transition-colors mt-1 group/link"
                      >
                        {job.name}
                        <ExternalLink className="w-3 h-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform duration-300" />
                      </a>
                    </div>
                  </div>

                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {job.summary}
                  </p>

                  {/* Decorative line */}
                  <div className="w-16 h-px bg-gradient-to-r from-terracotta to-transparent mt-8 opacity-0 group-hover:opacity-100 group-hover:w-32 transition-all duration-500" />
                </div>
              </article>
            </AnimatedSection>
          ))}
        </div>

        <div className="section-divider my-24" />
      </div>
    </section>
  );
}

// Skills Section with enhanced hover effects
function SkillsSection() {
  const skillCategories = {
    Frontend: ["Angular", "TypeScript", "Front-End Development"],
    Backend: ["C#", ".NET Framework/Core", "Node.js", "API Development", "T-SQL"],
    Cloud: ["Azure", "Databricks", "Pulumi", "Docker"],
    Identity: ["Identity Server", "Okta"],
    Process: ["Git", "Agile Methodologies", "Data-driven Applications"],
  };

  return (
    <section className="py-24 px-8 md:px-16 lg:px-24 bg-cream-dark/30" id="skills">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <div className="flex items-center gap-4 mb-16 group">
            <Code2 className="w-5 h-5 text-terracotta group-hover:rotate-12 transition-transform duration-300" />
            <h2 className="text-sm tracking-[0.3em] uppercase text-muted-foreground font-body">
              Skills & Technologies
            </h2>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-12">
          {Object.entries(skillCategories).map(([category, skills], catIndex) => (
            <AnimatedSection key={category} delay={catIndex * 100}>
              <div className="group">
                <h3 className="text-lg font-display font-semibold mb-6 flex items-center gap-3">
                  <span className="w-8 h-px bg-terracotta group-hover:w-12 transition-all duration-300" />
                  {category}
                </h3>
                <ul className="space-y-3">
                  {skills.map((skill, skillIndex) => (
                    <li
                      key={skill}
                      className="flex items-center gap-3 text-muted-foreground group/skill hover:text-foreground transition-colors duration-200 cursor-default"
                      style={{ animationDelay: `${(catIndex * 100) + (skillIndex * 50)}ms` }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-terracotta group-hover/skill:scale-150 transition-transform duration-200" />
                      <span className="relative">
                        {skill}
                        <span className="absolute bottom-0 left-0 w-0 h-px bg-terracotta group-hover/skill:w-full transition-all duration-300" />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <div className="section-divider my-24" />
      </div>
    </section>
  );
}

// Projects Section with GitHub data
function ProjectsSection() {
  const { repos, loading } = useGitHubStars();

  return (
    <section className="py-24 px-8 md:px-16 lg:px-24" id="projects">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <div className="flex items-center gap-4 mb-4 group">
            <Github className="w-5 h-5 text-terracotta group-hover:rotate-12 transition-transform duration-300" />
            <h2 className="text-sm tracking-[0.3em] uppercase text-muted-foreground font-body">
              Open Source Projects
            </h2>
          </div>
          <p className="text-muted-foreground mb-16 max-w-2xl">
            A selection of my pinned GitHub repositories — tools and frameworks I've built to solve real problems.
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-6">
          {repos.map((project, index) => (
            <AnimatedSection key={project.name} delay={index * 100}>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-6 border border-border bg-card hover:border-terracotta transition-all duration-300 group hover-lift relative overflow-hidden"
              >
                {/* Gradient hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-terracotta/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative">
                  {/* Header row */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-display font-semibold group-hover:text-terracotta transition-colors duration-300">
                        {project.name}
                      </h3>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-terracotta group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed mb-4 text-sm">
                    {project.description}
                  </p>

                  {/* Footer with language and stars */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: LANGUAGE_COLORS[project.language] || '#6b7280' }}
                      />
                      <span className="text-muted-foreground">{project.language}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-muted-foreground group-hover:text-terracotta transition-colors duration-300">
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Star className="w-4 h-4 fill-current" />
                          <span className="font-medium">{project.stars.toLocaleString()}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </a>
            </AnimatedSection>
          ))}
        </div>

        <div className="section-divider my-24" />
      </div>
    </section>
  );
}

// Certifications Section
function CertificationsSection() {
  return (
    <section className="py-24 px-8 md:px-16 lg:px-24" id="certifications">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <div className="flex items-center gap-4 mb-16 group">
            <Award className="w-5 h-5 text-terracotta group-hover:rotate-12 transition-transform duration-300" />
            <h2 className="text-sm tracking-[0.3em] uppercase text-muted-foreground font-body">
              Certifications
            </h2>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resume.certificates.map((cert, index) => (
            <AnimatedSection key={cert.name} delay={index * 50}>
              <div className="p-6 border border-border bg-card/50 hover:border-terracotta/50 transition-all duration-300 group hover:-translate-y-1 hover:shadow-lg">
                <h3 className="font-medium mb-2 group-hover:text-terracotta transition-colors duration-300">{cert.name}</h3>
                <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                {cert.startDate && (
                  <p className="text-xs text-slate-light mt-2">
                    {formatDate(cert.startDate)}
                  </p>
                )}
              </div>
            </AnimatedSection>
          ))}
        </div>

        <div className="section-divider my-24" />
      </div>
    </section>
  );
}

// Volunteer Section
function VolunteerSection() {
  return (
    <section className="py-24 px-8 md:px-16 lg:px-24 bg-cream-dark/30" id="volunteer">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <div className="flex items-center gap-4 mb-16 group">
            <Heart className="w-5 h-5 text-terracotta group-hover:scale-110 transition-transform duration-300" />
            <h2 className="text-sm tracking-[0.3em] uppercase text-muted-foreground font-body">
              Volunteer Work
            </h2>
          </div>
        </AnimatedSection>

        {resume.volunteer.map((vol, index) => (
          <AnimatedSection key={vol.organization} delay={index * 100}>
            <div className="grid md:grid-cols-12 gap-8 group">
              <div className="md:col-span-3">
                <p className="text-sm text-muted-foreground">
                  {formatDate(vol.startDate)} — {vol.endDate ? formatDate(vol.endDate) : "Present"}
                </p>
              </div>
              <div className="md:col-span-9">
                <h3 className="text-xl font-display font-semibold mb-2 group-hover:text-terracotta transition-colors duration-300">
                  {vol.position}
                </h3>
                <p className="text-terracotta mb-4">{vol.organization}</p>
                <p className="text-muted-foreground">{vol.summary}</p>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}

// Contact Section with Netlify Form
function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const params = new URLSearchParams();
      for (const [key, value] of formData.entries()) {
        params.append(key, value.toString());
      }

      const response = await fetch(window.location.pathname, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
      });

      if (response.ok) {
        setSubmitStatus('success');
        form.reset();
      } else {
        console.error('Form submission failed:', response.status, response.statusText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 px-8 md:px-16 lg:px-24" id="contact">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <div className="flex items-center gap-4 mb-4 group">
            <Send className="w-5 h-5 text-terracotta group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
            <h2 className="text-sm tracking-[0.3em] uppercase text-muted-foreground font-body">
              Let's Connect
            </h2>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-12 gap-12 mt-12">
          {/* Left column - Text */}
          <AnimatedSection className="md:col-span-5" delay={100}>
            <h3 className="text-4xl md:text-5xl font-display font-semibold mb-6 leading-tight">
              Have a project in mind?{" "}
              <span className="text-terracotta">Let's talk.</span>
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Interested in working together? I'm always open to discussing new opportunities,
              collaborations, or just having a conversation about technology and healthcare.
            </p>

            {/* Quick contact options */}
            <div className="space-y-4">
              <a
                href={`mailto:${resume.basics.email}`}
                className="flex items-center gap-4 p-4 border border-border hover:border-terracotta hover:bg-terracotta/5 transition-all duration-300 group"
              >
                <div className="w-10 h-10 bg-terracotta/10 flex items-center justify-center group-hover:bg-terracotta/20 transition-colors duration-300">
                  <Mail className="w-5 h-5 text-terracotta" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email me directly</p>
                  <p className="font-medium group-hover:text-terracotta transition-colors duration-300">{resume.basics.email}</p>
                </div>
              </a>

              <a
                href={resume.basics.profiles[0]?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 border border-border hover:border-terracotta hover:bg-terracotta/5 transition-all duration-300 group"
              >
                <div className="w-10 h-10 bg-terracotta/10 flex items-center justify-center group-hover:bg-terracotta/20 transition-colors duration-300">
                  <Linkedin className="w-5 h-5 text-terracotta" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Connect on LinkedIn</p>
                  <p className="font-medium group-hover:text-terracotta transition-colors duration-300">linkedin.com/in/{resume.basics.profiles[0]?.username}</p>
                </div>
              </a>
            </div>
          </AnimatedSection>

          {/* Right column - Form */}
          <AnimatedSection className="md:col-span-7" delay={200}>
            <div className="p-8 border border-border bg-card/50 relative overflow-hidden">
              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-24 h-24 border-r-2 border-t-2 border-terracotta/20" />

              <form
                className="space-y-6 relative"
                onSubmit={handleContactSubmit}
                name="contact"
                method="POST"
                data-netlify="true"
              >
                {/* Hidden input required for Netlify forms */}
                <input type="hidden" name="form-name" value="contact" />

                {/* Status messages */}
                {submitStatus === 'success' && (
                  <div className="flex items-center gap-3 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 p-4 border border-green-200 dark:border-green-700 animate-fade-in">
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    <p>Message sent successfully! I'll get back to you soon.</p>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="flex items-center gap-3 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-4 border border-red-200 dark:border-red-700 animate-fade-in">
                    <XCircle className="w-5 h-5 flex-shrink-0" />
                    <p>Failed to send message. Please try again or email me directly at {resume.basics.email}</p>
                  </div>
                )}

                {/* Form fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="group">
                    <label htmlFor="name" className="block text-sm font-medium mb-2 group-focus-within:text-terracotta transition-colors duration-300">
                      Name <span className="text-terracotta">*</span>
                    </label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your name"
                      required
                      className="bg-background focus:border-terracotta transition-all duration-300"
                    />
                  </div>
                  <div className="group">
                    <label htmlFor="email" className="block text-sm font-medium mb-2 group-focus-within:text-terracotta transition-colors duration-300">
                      Email <span className="text-terracotta">*</span>
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      required
                      className="bg-background focus:border-terracotta transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="group">
                  <label htmlFor="subject" className="block text-sm font-medium mb-2 group-focus-within:text-terracotta transition-colors duration-300">
                    Subject <span className="text-terracotta">*</span>
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="What's this about?"
                    required
                    className="bg-background focus:border-terracotta transition-all duration-300"
                  />
                </div>

                <div className="group">
                  <label htmlFor="message" className="block text-sm font-medium mb-2 group-focus-within:text-terracotta transition-colors duration-300">
                    Message <span className="text-terracotta">*</span>
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell me about your project, opportunity, or just say hi!"
                    rows={5}
                    required
                    className="bg-background focus:border-terracotta transition-all duration-300"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-terracotta text-cream font-medium hover:bg-terracotta-dark transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer className="py-16 px-8 md:px-16 lg:px-24 border-t border-border bg-cream-dark/20">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <p className="text-2xl font-display font-semibold mb-2">
              Timothy M. Barani
            </p>
            <p className="text-muted-foreground text-sm">
              Software Engineer · Healthcare Technology
            </p>
          </div>

          <div className="flex gap-4">
            <a
              href={`mailto:${resume.basics.email}`}
              className="p-3 border border-border hover:border-terracotta hover:bg-terracotta hover:text-cream transition-all duration-300 group"
              aria-label="Email"
            >
              <Mail className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            </a>
            <a
              href={resume.basics.profiles[0]?.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 border border-border hover:border-terracotta hover:bg-terracotta hover:text-cream transition-all duration-300 group"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            </a>
            <a
              href="https://github.com/tbosak"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 border border-border hover:border-terracotta hover:bg-terracotta hover:text-cream transition-all duration-300 group"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            </a>
            <a
              href="/resources/timbresume11-3.pdf"
              download="Timothy_Barani_Resume.pdf"
              className="p-3 border border-border hover:border-terracotta hover:bg-terracotta hover:text-cream transition-all duration-300 group"
              aria-label="Download Resume"
            >
              <Download className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            </a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Timothy M. Barani. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

// Navigation
function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { href: "#about", label: "About" },
    { href: "#experience", label: "Experience" },
    { href: "#skills", label: "Skills" },
    { href: "#projects", label: "Projects" },
    { href: "#certifications", label: "Certifications" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <nav
      className={`hidden lg:block fixed top-0 right-0 z-50 p-6 transition-all duration-500 ${
        isScrolled ? "opacity-100 translate-y-0" : "opacity-0 pointer-events-none -translate-y-4"
      }`}
    >
      <div className="flex gap-2 bg-card/95 backdrop-blur-md border border-border p-2 shadow-xl">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-terracotta/10 transition-all duration-300 relative group"
          >
            {item.label}
            <span className="absolute bottom-1 left-1/2 w-0 h-px bg-terracotta -translate-x-1/2 group-hover:w-3/4 transition-all duration-300" />
          </a>
        ))}
      </div>
    </nav>
  );
}

// Main App
export function App() {
  return (
    <div className="grain">
      <Navigation />
      <main>
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <SkillsSection />
        <ProjectsSection />
        <CertificationsSection />
        <VolunteerSection />
        <ContactSection />
        <Footer />
      </main>
    </div>
  );
}

export default App;
