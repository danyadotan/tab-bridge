# TAB Bridge

TAB AI assistant with Bridge-iT orchestration - monorepo with React UI, Browser Extension, and Tauri desktop app.

## Project Structure

```
tab-bridge/
├── apps/
│   ├── settings-ui/          # React settings panel (Vite + TypeScript)
│   │   ├── src/
│   │   │   ├── App.tsx       # Main demo with themes & settings
│   │   │   └── main.tsx      # Entry point
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── vite.config.ts
│   └── extension/            # Chrome Extension (MV3)
│       ├── manifest.json     # Extension manifest
│       ├── content.js        # Content script
│       └── overlay.css       # Overlay styles
├── packages/                 # Shared packages (coming soon)
├── package.json              # Root monorepo config
├── pnpm-workspace.yaml       # pnpm workspace config
└── turbo.json               # Turborepo config
```

## Features

- **4 Theme Options**: Serene Dark (default), Purple Dark, Green Dark, Cream
- - **Accessibility**: Dyslexia-friendly font toggle
  - - **Privacy Modes**: Local-Only (default) or Hybrid sync
    - - **Sensing Levels**: S0-S3 with transparency indicators
      - - **Goal Tracking**: 4+1 model with daily carry-over
        - - **Vending Agents**: File Sorter, Form Filler, Route Helper (demo)
          - - **Keyboard Shortcuts**: Ctrl+; to toggle panel
           
            - ## Getting Started
           
            - ### Prerequisites
            - - Node.js >= 18
              - - pnpm >= 8.15.0
               
                - ### Install Dependencies
                - ```bash
                  pnpm install
                  ```

                  ### Run Settings UI
                  ```bash
                  cd apps/settings-ui
                  pnpm dev
                  ```

                  ### Load Browser Extension
                  1. Open Chrome/Edge and go to `chrome://extensions`
                  2. 2. Enable "Developer mode"
                     3. 3. Click "Load unpacked"
                        4. 4. Select the `apps/extension` folder
                          
                           5. ## Tech Stack
                          
                           6. - **Build**: Turborepo + pnpm workspaces
                              - - **UI**: React 18 + TypeScript + Vite
                                - - **Extension**: Chrome Manifest V3
                                  - - **Themes**: CSS custom properties with 4 color schemes
                                   
                                    - ## License
                                   
                                    - MIT
