<div align="center">
  <h1>Next Motion UI</h1>
  <p>A Next.js 16 starter kit with animated UI components — Aceternity-style sparkles, spotlight, flip-words, typewriter effects, and particle animations powered by <strong>framer-motion</strong> and <strong>tsparticles</strong>.</p>
  <p>
    <a href="#components">Components</a> ·
    <a href="#getting-started">Getting Started</a> ·
    <a href="#tech-stack">Tech Stack</a> ·
    <a href="#project-structure">Structure</a>
  </p>
  <br/>
</div>

---

## ✨ Components

| Component | Description |
|-----------|-------------|
| `BackgroundBeams` | Ambient animated beam background |
| `FlipWords` | Smooth word-flip animation |
| `PlaceholdersAndVanishInput` | Animated input with placeholder morphing |
| `Sparkles` | Sparkle particle effect |
| `Spotlight` | Spotlight hover effect |
| `Lamp` | Illuminated lamp effect |
| `TypewriterEffect` | Typewriter text animation |
| `TextGenerateEffect` | Fade-in text reveal |
| `HoverBorderGradient` | Gradient border on hover |

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

### Build

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

## 🛠 Tech Stack

| Tech | Version |
|------|---------|
| [Next.js](https://nextjs.org/) | 16.0.10 |
| [React](https://react.dev/) | 19.2.1 |
| [Tailwind CSS](https://tailwindcss.com/) | v4 |
| [TypeScript](https://www.typescriptlang.org/) | 5.x |
| [Framer Motion](https://motion.dev/) | 12.x |
| [tsparticles](https://particles.js.org/) | 3.x |
| [Lucide Icons](https://lucide.dev/) | 0.561.x |

## 📁 Project Structure

```
├── app/
│   ├── globals.css          # Tailwind v4 + theme variables
│   ├── layout.tsx           # Root layout with fonts (Geist + Kanit)
│   └── page.tsx             # Home page with animated showcase
├── components/
│   └── ui/                  # Animated UI components
│       ├── background-beams.tsx
│       ├── button.tsx
│       ├── flip-words.tsx
│       ├── hover-border-gradient.tsx
│       ├── lamp.tsx
│       ├── placeholders-and-vanish-input.tsx
│       ├── sparkles.tsx
│       ├── spotlight.tsx
│       ├── text-generate-effect.tsx
│       └── typewriter-effect.tsx
├── lib/
│   └── utils.ts             # Tailwind merge utility
├── public/                  # Static assets
├── .github/
│   └── copilot-instructions.md  # GitHub Copilot context
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

## 🎨 Customization

- **Fonts**: Supports both Geist (English) and Kanit (Thai) via `next/font`
- **Dark Mode**: Implemented via CSS `prefers-color-scheme` in `globals.css`
- **Animated Components**: Fully customizable — tweak colors, durations, and animations in each component file

## 📄 License

MIT