# Aidan Wolter - Personal Website (`aidanwolter.com`)

A slick, lightweight, 100% static personal website for Staff Software Engineer Aidan Wolter.

## 🚀 Two Synchronized Interfaces

The site features two interactive presentation modes with responsive defaults (Terminal on desktop, Spotlight on mobile, toggleable anytime):

1. **Modern Unix Terminal (`Ghostty / Zsh` aesthetic)**
   - Monospace typography, acrylic blur titlebar, traffic light window controls.
   - Interactive shell with command history (`↑` / `↓`), tab completion, and clear (`Ctrl+L`).
   - Grounded commands: `whoami`, `experience`, `projects`, `skills`, `neofetch`, `linkedin`, `github`, `contact`, `matrix`, `theme`, `clear`.
   - Matrix digital rain animation overlay (`matrix` command or button).
   - Touch-friendly quick command pills for mobile visitors.

2. **Raycast / Spotlight Command Palette**
   - High-end dark editorial card with ambient glowing mesh background.
   - Press <kbd>⌘</kbd> + <kbd>K</kbd> (or click the search bar) to open a floating Raycast-style command palette with frosted glass backdrop blur.
   - Instant fuzzy filtering across career history (Google L6, Garmin, Tyler JC), projects, LinkedIn, and themes.
   - Synthesized mechanical switch audio haptics using the Web Audio API (toggleable).
   - Interactive modal dialogs for career timeline and open-source projects.

3. **View Switcher & Responsive Defaults**
   - **Desktop (> 768px)**: Defaults to **Terminal** mode.
   - **Mobile (≤ 768px)**: Defaults to **Spotlight** mode.
   - Switch anytime with header buttons or shortcuts: <kbd>Alt</kbd> + <kbd>1</kbd> (Terminal), <kbd>Alt</kbd> + <kbd>2</kbd> (Spotlight), <kbd>Alt</kbd> + <kbd>3</kbd> (Split).

---

## 🛠 Local Development & Preview

To preview locally, start a quick static HTTP server:

```bash
# Using Python 3:
python3 -m http.server 8000

# Or using Node:
npx serve .
```

Then visit [http://localhost:8000](http://localhost:8000) in your browser.

---

## 🌐 100% Free Hosting on GitHub Pages

Because this site is built with pure, zero-dependency modern HTML, CSS, and vanilla ES modules:
- No npm build steps, Webpack, or Bundlers required.
- **GitHub Pages setup**:
  1. Create a repository on GitHub (e.g. `aidanwolter3/aidanwolter3.github.io` or `aidanwolter3/aidanwolter.com`).
  2. Push this directory to the repository.
  3. Go to **Settings** → **Pages** → Source: `Deploy from a branch` (`main` / root `/`).
  4. Your site will be live instantly with a free SSL certificate!
