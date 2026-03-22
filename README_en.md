# CoverShift 跃像

<div align="center">
  <h1>✨ CoverShift 跃像 ✨</h1>
  <p><strong>Your Fashion Time Machine — Transform photos into magazine covers across decades</strong></p>
  <p><strong>你的时尚时光机 — 将照片穿越到各个年代</strong></p>
</div>

---

## Demo Showcase

Upload a photo, select decades, and generate fashion magazine covers from the 1920s to 2000s:

| 1920s | 1930s | 1940s | 1950s | 1960s |
|:-----:|:-----:|:-----:|:-----:|:-----:|
| <img src="https://raw.githubusercontent.com/lrosa72/CoverShift/main/public/docs/assets/bazaar-1920s.jpg" width="150"> | <img src="https://raw.githubusercontent.com/lrosa72/CoverShift/main/public/docs/assets/bazaar-1930s.jpg" width="150"> | <img src="https://raw.githubusercontent.com/lrosa72/CoverShift/main/public/docs/assets/bazaar-1940s.jpg" width="150"> | <img src="https://raw.githubusercontent.com/lrosa72/CoverShift/main/public/docs/assets/bazaar-1950s.jpg" width="150"> | <img src="https://raw.githubusercontent.com/lrosa72/CoverShift/main/public/docs/assets/bazaar-1960s.jpg" width="150"> |

| 1970s | 1980s | 1990s | 2000s |
|:-----:|:-----:|:-----:|:-----:|
| <img src="https://raw.githubusercontent.com/lrosa72/CoverShift/main/public/docs/assets/bazaar-1970s.jpg" width="150"> | <img src="https://raw.githubusercontent.com/lrosa72/CoverShift/main/public/docs/assets/bazaar-1980s.jpg" width="150"> | <img src="https://raw.githubusercontent.com/lrosa72/CoverShift/main/public/docs/assets/bazaar-1990s.jpg" width="150"> | <img src="https://raw.githubusercontent.com/lrosa72/CoverShift/main/public/docs/assets/bazaar-2000s.jpg" width="150"> |

---

## Project Introduction

CoverShift is an AI-powered fashion magazine cover generator that transforms your photos into magazine covers from different eras and styles using a configurable image model API.

**Key Features:**

### Core Features
- ✅ **Enhanced Face Consistency** - Toggle to prioritize facial feature preservation for better likeness
- ✅ **Multi-Magazine Support** - 9 magazine styles (Harper's Bazaar, Vogue, Elle, GQ, Vanity Fair, L'Officiel, Interview, i-D, W Magazine)
- ✅ **Flexible Era Selection** - Choose from 1920s to 2100s
- ✅ **Random Mode** - Let fate decide your fashion journey
- ✅ **Preset Themes** - Golden Age, Disco Era, Millennial, Future Forward, and more
- ✅ **Creative Styles** - 18 artistic styles + Original Era Style (19 total options)
- ✅ **Custom Prompts** - Describe your own style
- ✅ **History** - Save and reload previous results
- ✅ **Gallery Views** - Scattered cards or neat grid layout
- 🖼️ Real-time generation with dual concurrency
- 💾 Single download, ZIP batch download, album poster
- 📱 Responsive design, draggable cards on desktop
- 🔄 Regenerate individual images

### Creative Style Examples
| Style | Description |
|-------|-------------|
| 🎭 Cyberpunk | Neon lights, rain-soaked streets, high-tech low-life |
| 💗 Vaporwave | 80s nostalgia, pastel colors, Greek statues |
| 🏛️ Neoclassical | Renaissance aesthetics, oil painting texture |
| 🎬 Film Noir | Classic black & white, dramatic shadows |
| 🖌️ Japanese Ink | Traditional East Asian, sumi-e painting |
| 🌃 Glitch Art | Digital corruption, RGB shift effects |

### Magazine Styles
| Magazine | Style |
|----------|-------|
| Harper's Bazaar | Classic elegance, museum-quality |
| Vogue | High fashion, supermodel aesthetic |
| Elle | Youthful, vibrant, Parisian chic |
| GQ | Masculine elegance, urban professional |
| Vanity Fair | Old-world glamour, Hollywood golden age |
| L'Officiel | Avant-garde, experimental |
| Interview | Andy Warhol, pop art |
| i-D | Street culture, documentary |
| W Magazine | Contemporary art, conceptual |

---

## Quick Start

### Prerequisites

- Node.js 18+
- An image model API Key (from your selected provider)

### Installation

1. **Clone or download the project**
   ```bash
   cd CoverShift
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API Key**

   **Use the in-app modal (Recommended)**
   - Run `npm run dev`
   - The API Key setup modal will appear automatically on first visit
   - Or click the ⚙️ settings icon (top-left corner) anytime

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open browser**
   Visit http://localhost:3000

---

## Usage Guide

### Basic Workflow

1. **Upload Photo**
   - Click the magazine cover on the homepage
   - Select a clear portrait photo

2. **Select Magazines**
   - Choose 1-9 magazines for the cover style
   - Each magazine has unique typography and color schemes

3. **Select Eras**
   - **Custom Mode**: Click to select specific decades
   - **Random Mode**: Click "Surprise Me!" for random selection
   - **Preset Mode**: Choose theme presets like "Golden Age" or "Future Forward"

4. **Advanced Options (Optional)**
   - **Creative Style**: Add artistic effects like Cyberpunk, Vaporwave, etc.
   - **Custom Prompt**: Write your own description using `{decade}` placeholder

5. **Generate Covers**
   - Click "Generate"
   - View real-time progress indicators
   - Wait for AI to generate all covers

6. **View Results**
   - **Scattered View**: Draggable scattered cards
   - **Gallery View**: Neat grid layout

7. **Download**
   - **Download All (ZIP)**: All covers as a ZIP file
   - **Download Album**: Single poster with all covers
   - **Individual Download**: Hover and click download button

8. **Save to History**
   - Click "Save to History"
   - Click clock icon (top-right) to view history

9. **Regenerate**
   - Hover on any cover, click refresh button to regenerate

---

## Project Structure

```
CoverShift/
├── components/
│   ├── MagazineCover.tsx          # Magazine cover component (multi-style)
│   ├── PolaroidCard.tsx           # Polaroid card
│   ├── DecadeSelector.tsx         # Era selector (custom/random/preset)
│   ├── MagazineSelector.tsx       # Magazine selector
│   ├── CreativeStyleSelector.tsx   # Creative style selector
│   ├── ViewToggle.tsx             # View toggle
│   ├── CustomPromptEditor.tsx     # Custom prompt editor
│   ├── HistoryPanel.tsx           # History panel
│   ├── ApiKeyModal.tsx            # API Key configuration modal
│   ├── Footer.tsx                 # Footer
│   └── ui/
│       └── draggable-card.tsx     # Draggable card
├── hooks/
│   └── usePlayerProgress.ts       # Player progress & achievements state
├── src/
│   └── config/
│       ├── magazines.ts           # Magazine configurations
│       ├── eras.ts                # Era configurations (1920s-2100s)
│       ├── creativeStyles.ts      # Creative style configs (19 options)
│       ├── presets.ts             # Preset theme configs
│       ├── randomEvents.ts        # Random events system
│       └── achievements.ts        # Achievement system
├── services/
│   ├── imageModelService.ts       # Image model API call + retry
│   ├── generationService.ts       # Generation task orchestration
│   └── promptBuilder.ts           # Unified prompt builder
├── lib/
│   ├── albumUtils.ts              # Album generation
│   ├── historyUtils.ts            # History utilities
│   └── utils.ts                   # Common utilities
├── src-tauri/                     # Native shell (Tauri)
├── App.tsx                        # Main app component
├── index.tsx                      # Entry file
├── vite.config.ts                 # Vite config
├── tsconfig.json                  # TypeScript config
└── package.json
```

---

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (port 3000) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

---

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Framer Motion** - Animations
- **Image Model API** - AI image generation
- **JSZip** - ZIP file generation
- **LocalStorage** - History storage

---

## Notes

1. **API Key Security**: API Key is stored in localStorage on your device
2. **Photo Quality**: Clear frontal portraits work best
3. **Generation Time**: First generation may take longer, please wait
4. **Quota Limits**: Monitor your model API quota usage
5. **History**: Stored in browser LocalStorage, clearing browser data will lose history

---

## Roadmap

Future improvements could include:

- [ ] Share to social media directly
- [ ] Watermark options
- [ ] Export to PDF
- [ ] Batch regenerate failed covers
- [ ] Prompt template library
- [ ] Multi-person mode (group photos)
- [ ] Movie poster styles
- [ ] Career transformation modes

---

## License

Apache-2.0
