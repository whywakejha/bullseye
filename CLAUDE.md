# Bullseye — Paper Ball Toss Game

**Mantra: "It needs to look and feel Pixar."**

## Stack
- React + Vite
- Three.js via React Three Fiber (`@react-three/fiber`)
- Drei helpers (`@react-three/drei`)
- Rapier physics (`@react-three/rapier`)
- Post-processing (`@react-three/postprocessing`)

## Commands
- `npm run dev` — start dev server
- `npm run build` — production build to `dist/`
- `npm run preview` — preview production build
- `npm run lint` — ESLint

## Conventions
- All 3D components live in `src/components/`
- HTML overlay UI lives in `src/ui/`
- Game state hooks in `src/hooks/`
- Keep components focused: one concern per file
- Pixar-quality lighting and shading is non-negotiable

## Containerization
- `.nvmrc` pins the Node version
- `Dockerfile` + `nginx.conf` for production container
- `package-lock.json` is committed for reproducible installs
- All deps tracked in `package.json` — no global installs assumed
