export interface Event {
    slug: string
    title: string
    shortDescription: string
    fullDescription: string
    date: string
    time: string
    venue: string
    teamSize: string
    maxTeamSize: number
    image: string // Ensure this points to a valid image path or placeholder
    status: "Open" | "Closed"
    category: "Technical" | "Non-Technical" | "Hackathon" | "Workshop"
    showOnHighlights?: boolean
}

export const events: Event[] = [
    {
        slug: "paper-presentation",
        title: "Paper Presentation",
        shortDescription: "Showcase your research and ideas in AI/ML.",
        fullDescription: "A platform to present your innovative research papers and ideas in the field of Artificial Intelligence and Machine Learning. Compete with the best minds and win exciting prizes.",
        date: "2025-03-15",
        time: "10:00 AM",
        venue: "Main Auditorium",
        teamSize: "1-2",
        maxTeamSize: 2,
        image: "/images/events/paper-presentation.jpg",
        status: "Open",
        category: "Technical"
    },
    {
        slug: "project-expo",
        title: "Project Expo",
        shortDescription: "Display your AI/ML projects to industry experts.",
        fullDescription: "Demonstrate your working models and prototypes. Get feedback from experts and network with peers.",
        date: "2025-03-15",
        time: "02:00 PM",
        venue: "Assembly Hall",
        teamSize: "2-4",
        maxTeamSize: 4,
        image: "/images/events/project-expo.jpg",
        status: "Open",
        category: "Technical"
    },
    {
        slug: "hackathon",
        title: "Neural Hack 2.0",
        shortDescription: "24-hour non-stop coding marathon.",
        fullDescription: "Solve real-world problems using AI/ML in this intense 24-hour hackathon. Mentorship sessions and food provided.",
        date: "2025-03-16",
        time: "09:00 AM",
        venue: "Library Block",
        teamSize: "3-5",
        maxTeamSize: 5,
        image: "/images/events/hackathon.jpg",
        status: "Open",
        category: "Hackathon"
    },
    {
        slug: "ui-with-ai",
        title: "UI With AI",
        shortDescription: "Design intuitive interfaces powered by AI.",
        fullDescription: "A design challenge where you create UI/UX that integrates AI features seamlessly.",
        date: "2025-03-17",
        time: "10:00 AM",
        venue: "Lab 4",
        teamSize: "1-2",
        maxTeamSize: 2,
        image: "/images/events/ui-with-ai.jpg",
        status: "Open",
        category: "Technical"
    },
    {
        slug: "pixel-perfect-ai",
        title: "Pixel Perfect AI",
        shortDescription: "Generate and refine art with AI tools.",
        fullDescription: "Test your prompting skills and artistic vision using Generative AI tools.",
        date: "2025-03-17",
        time: "02:00 PM",
        venue: "Lab 5",
        teamSize: "1",
        maxTeamSize: 1,
        image: "/images/events/pixel-perfect.jpg",
        status: "Closed",
        category: "Non-Technical"
    },
    {
        slug: "escape-quest",
        title: "Escape Quest",
        shortDescription: "Solve puzzles to escape the room.",
        fullDescription: "A fun, brain-teasing event where you solve tech and logic puzzles to unlock the exit.",
        date: "2025-03-18",
        time: "10:00 AM",
        venue: "Classroom 302",
        teamSize: "3-4",
        maxTeamSize: 4,
        image: "/images/events/escape-quest.jpg",
        status: "Open",
        category: "Non-Technical"
    }
]

export const teamMembers = [
    {
        name: "Alex Johnson",
        role: "President",
        image: "/images/team/alex.jpg",
        linkedin: "#",
        github: "#"
    },
    {
        name: "Sam Smith",
        role: "Vice President",
        image: "/images/team/sam.jpg",
        linkedin: "#",
        github: "#"
    },
    {
        name: "Jordan Lee",
        role: "Tech Lead",
        image: "/images/team/jordan.jpg",
        linkedin: "#",
        github: "#"
    },
    {
        name: "Casey Taylor",
        role: "Event Coordinator",
        image: "/images/team/casey.jpg",
        linkedin: "#",
        github: "#"
    }
]

export const projects = [
    {
        title: "AI Traffic Control",
        description: "Using Computer Vision to optimize traffic flow in real-time.",
        tech: ["Python", "OpenCV", "YOLO"],
        link: "#"
    },
    {
        title: "Health Bot",
        description: "NLP-powered chatbot for preliminary diagnosis.",
        tech: ["Llama 2", "React", "FastAPI"],
        link: "#"
    },
    {
        title: "EcoSort",
        description: "Automated waste segregation using Image Classification.",
        tech: ["TensorFlow", "Raspberry Pi"],
        link: "#"
    }
]

export const achievements = [
    {
        title: "Best Tech Event Award",
        year: "2024",
        description: " Recognized by CBIT for outstanding contributions to the student community."
    },
    {
        title: "National Hackathon Winners",
        year: "2023",
        description: "Our team 'Neural Net' won 1st place at Smart India Hackathon."
    },
    {
        title: "100+ Sessions Conducted",
        year: "2023",
        description: "Crossed a milestone of hosting over 100 technical and non-technical sessions."
    },
    {
        title: "Event Founded",
        year: "2023",
        description: "NeuroVerse was established to foster AI/ML learning."
    }
]
