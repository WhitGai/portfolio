# Mission Control Design System

> Source: nexu-io/open-design · design-systems/mission-control/DESIGN.md (Apache-2.0/MIT)
> Pulled directly from the repo and saved locally as a reusable design-system spec.
> Category: Developer Tools — space/aerospace mission monitoring. Dark command center, amber telemetry, monospace precision.

## Core palette
| Element | Hex | Role |
|---|---|---|
| Background | `#0B1120` | Deep space navy, primary canvas |
| Surface | `#111827` | Elevated panels, cards |
| Surface Hover | `#1A2535` | Interactive surface hover |
| Surface Active | `#1E3A5F` | Selected/active panel |
| Border | `#1E3A5F` | Panel dividers |
| Border Subtle | `#162035` | Inner dividers |
| Primary Data | `#FFB800` | Telemetry values, key metrics (amber) |
| Accent | `#00D4FF` | Active/healthy indicators (cyan) |
| Success | `#26DE81` | Nominal status |
| Alert Warning | `#FF9F43` | Degraded |
| Alert Critical | `#FF4757` | Errors/abort |
| Text Primary | `#E8F0FE` | High-contrast text |
| Text Secondary | `#8BA3C7` | Labels |
| Text Tertiary | `#4A6080` | Timestamps/metadata only |

Native dark mode only. All data colors pass WCAG AA on `#111827`.

## Typography
- Display / data: `"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`
- Sans (labels/prose): `"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`
- Scale: Display 48/700/1.0 mono · H1 18/600 · H2 13/600 uppercase tracked · Body 14/400/1.5 · Caption 12 · Micro 10/600 uppercase

## Spacing — 4px baseline
4 / 8 / 12 / 16 / 20 / 24 / 32 / 48 / 64 / 80.

## Layout
12-col grid, 4px gutters, dense but grouped. Panels: surface bg, 1px border, radius 4px, 16px pad. Panel header: flex space-between, uppercase tracked title in secondary text, bottom border subtle.

## Signature components
Status badge (nominal/warning/critical, 10px uppercase tracked, radius 2px, tinted bg + border). Data tile (uppercase label + big mono amber value + tertiary unit). Countdown (48px mono amber). Signal-strength bars. Alert banner (left 4px critical border). Telemetry sparkline. Progress bar (4px, cyan fill).

## Motion
fast 100ms ease-in · base 150ms ease-out · slow 300ms ease-out. Alert pulse 2s glow loop. Value-change background flash. Respect prefers-reduced-motion.

## Voice
Precise, data-first, sparse. UI speaks through values and color, not prose. Visual urgency maps to operational urgency.

## Anti-patterns
No decorative colors in data — every hue means something. No rounded corners > 4px. Monospace only for data values. Animate only alerts/signals. No light mode. No low-contrast text (tertiary is metadata-only).
