export type Locale = "en" | "es";

export const locales: Locale[] = ["en", "es"];

export const dictionaries = {
  en: {
    nav: { product: "Product", demo: "Demo", dashboard: "Dashboard", settings: "Settings", account: "Account", login: "Log in", signup: "Create my CV", logout: "Log out" },
    landing: {
      heroEyebrow: "Premium CV builder for ambitious candidates",
      heroTitle: "Create a professional CV that actually represents you.",
      heroText: "CVForge turns your raw achievements, projects, education, and goals into polished, targeted CVs in English or Spanish.",
      primaryCta: "Create my CV",
      secondaryCta: "View demo",
      how: "Answer deeply, refine confidently, export beautifully.",
      benefits: ["AI-ready optimization without invented facts", "ATS-friendly structure and actionable scoring", "Three polished templates for different applications", "Bilingual UI and CV output"],
      sections: { howItWorks: "How it works", features: "What you get", preview: "Example preview" },
    },
    auth: { welcome: "Welcome back", create: "Create your account", email: "Email", password: "Password", login: "Log in", signup: "Sign up", google: "Continue with Google", noAccount: "No account?", hasAccount: "Already have an account?" },
    dashboard: { title: "Your CV workspace", subtitle: "Build, tailor, score, and export every version from one place.", create: "Create new CV", profile: "Profile completion", score: "CV score", recent: "Recent activity", missing: "Missing information", empty: "No CV versions yet. Create your first tailored CV.", continue: "Continue onboarding", edit: "Edit", preview: "Preview", duplicate: "Duplicate", delete: "Delete" },
    onboarding: { title: "Tell CVForge the real story", subtitle: "The better the raw material, the stronger the CV. Save progress at every step.", next: "Next", back: "Back", finish: "Finish onboarding", steps: ["Identity", "Contact", "Objective", "Education", "Skills", "Experience", "Projects", "Achievements", "Style", "Target"] },
    builder: { title: "CV Builder", preview: "Live preview", score: "Quality score", optimize: "Optimize text", export: "Export PDF", print: "Print / Save as PDF", save: "Save", add: "Add", copy: "Copy", template: "Template", language: "CV language", tone: "Tone", purpose: "Purpose", target: "Target opportunity", photo: "Profile photo", includePhoto: "Include photo" },
    sections: { summary: "Professional Summary", education: "Education", experience: "Experience", projects: "Projects", achievements: "Achievements", skills: "Skills", languages: "Languages", certifications: "Certifications" },
    templates: { modern: "Modern", classic: "Classic", minimal: "Minimal" },
    forms: { include: "Include in CV", required: "Required", optional: "Optional", title: "Title", organization: "Organization", date: "Date", level: "Level", placement: "Placement", participants: "Participants", selectionRate: "Selection rate", prize: "Prize or value", description: "Description", difficulty: "Why it was difficult", demonstrated: "Skills demonstrated", impact: "Impact", proof: "Proof link", role: "Role title", location: "Location", start: "Start date", end: "End date", current: "Current", mode: "Work mode", responsibilities: "Responsibilities", achievements: "Achievements", tools: "Tools used", metrics: "Metrics/results", team: "Team size", leadership: "Leadership", problem: "Problem solved", project: "Project name", technologies: "Technologies", features: "Features built", github: "GitHub URL", demo: "Demo URL", active: "Still active", institution: "Institution", degree: "Degree/program", field: "Field of study", gpa: "GPA/grades", coursework: "Coursework", honors: "Honors", skill: "Skill name", category: "Category", proficiency: "Proficiency", certification: "Certification", issuer: "Issuer", credential: "Credential URL" },
    score: { completeness: "Completeness", clarity: "Clarity", impact: "Impact", ats: "ATS", contact: "Contact", achievement: "Achievement strength", skills: "Skills relevance", formatting: "Formatting", suggestions: "Suggestions" },
    common: { loading: "Loading...", configured: "Supabase is not configured yet. Add environment variables to enable saving and authentication.", saveSuccess: "Saved", error: "Something went wrong", english: "English", spanish: "Español" },
  },
  es: {
    nav: { product: "Producto", demo: "Demo", dashboard: "Panel", settings: "Ajustes", account: "Cuenta", login: "Entrar", signup: "Crear mi CV", logout: "Salir" },
    landing: {
      heroEyebrow: "Constructor premium de CV para candidatos ambiciosos",
      heroTitle: "Crea un CV profesional que realmente te represente.",
      heroText: "CVForge convierte tus logros, proyectos, educación y metas en CVs pulidos y dirigidos en inglés o español.",
      primaryCta: "Crear mi CV",
      secondaryCta: "Ver demo",
      how: "Responde a fondo, mejora con confianza y exporta con elegancia.",
      benefits: ["Optimización con IA sin inventar datos", "Estructura ATS y puntuación útil", "Tres plantillas profesionales", "Interfaz y salida de CV bilingües"],
      sections: { howItWorks: "Cómo funciona", features: "Qué incluye", preview: "Vista previa" },
    },
    auth: { welcome: "Bienvenido de vuelta", create: "Crea tu cuenta", email: "Correo", password: "Contraseña", login: "Entrar", signup: "Registrarme", google: "Continuar con Google", noAccount: "¿No tienes cuenta?", hasAccount: "¿Ya tienes cuenta?" },
    dashboard: { title: "Tu espacio de CVs", subtitle: "Crea, adapta, puntúa y exporta cada versión desde un solo lugar.", create: "Crear nuevo CV", profile: "Perfil completo", score: "Puntuación del CV", recent: "Actividad reciente", missing: "Información faltante", empty: "Aún no tienes versiones. Crea tu primer CV.", continue: "Continuar onboarding", edit: "Editar", preview: "Vista previa", duplicate: "Duplicar", delete: "Eliminar" },
    onboarding: { title: "Cuéntale la historia real a CVForge", subtitle: "Mientras mejor sea la materia prima, más fuerte será el CV. Guarda en cada paso.", next: "Siguiente", back: "Atrás", finish: "Finalizar onboarding", steps: ["Identidad", "Contacto", "Objetivo", "Educación", "Habilidades", "Experiencia", "Proyectos", "Logros", "Estilo", "Objetivo"] },
    builder: { title: "Constructor de CV", preview: "Vista en vivo", score: "Puntuación", optimize: "Mejorar texto", export: "Exportar PDF", print: "Imprimir / Guardar PDF", save: "Guardar", add: "Agregar", copy: "Copiar", template: "Plantilla", language: "Idioma del CV", tone: "Tono", purpose: "Propósito", target: "Oportunidad objetivo", photo: "Foto de perfil", includePhoto: "Incluir foto" },
    sections: { summary: "Resumen Profesional", education: "Educación", experience: "Experiencia", projects: "Proyectos", achievements: "Logros", skills: "Habilidades", languages: "Idiomas", certifications: "Certificaciones" },
    templates: { modern: "Moderna", classic: "Clásica", minimal: "Minimalista" },
    forms: { include: "Incluir en CV", required: "Requerido", optional: "Opcional", title: "Título", organization: "Organización", date: "Fecha", level: "Nivel", placement: "Lugar/ranking", participants: "Participantes", selectionRate: "Tasa de selección", prize: "Premio o valor", description: "Descripción", difficulty: "Por qué fue difícil", demonstrated: "Habilidades demostradas", impact: "Impacto", proof: "Enlace de prueba", role: "Puesto", location: "Ubicación", start: "Inicio", end: "Fin", current: "Actual", mode: "Modalidad", responsibilities: "Responsabilidades", achievements: "Logros", tools: "Herramientas", metrics: "Métricas/resultados", team: "Tamaño del equipo", leadership: "Liderazgo", problem: "Problema resuelto", project: "Nombre del proyecto", technologies: "Tecnologías", features: "Funciones creadas", github: "URL de GitHub", demo: "URL de demo", active: "Sigue activo", institution: "Institución", degree: "Programa/grado", field: "Área de estudio", gpa: "Promedio/notas", coursework: "Cursos relevantes", honors: "Honores", skill: "Habilidad", category: "Categoría", proficiency: "Dominio", certification: "Certificación", issuer: "Emisor", credential: "URL de credencial" },
    score: { completeness: "Completitud", clarity: "Claridad", impact: "Impacto", ats: "ATS", contact: "Contacto", achievement: "Fuerza de logros", skills: "Relevancia de habilidades", formatting: "Formato", suggestions: "Sugerencias" },
    common: { loading: "Cargando...", configured: "Supabase aún no está configurado. Agrega variables de entorno para guardar e iniciar sesión.", saveSuccess: "Guardado", error: "Algo salió mal", english: "English", spanish: "Español" },
  },
} as const;

export type Dictionary = typeof dictionaries.en;
