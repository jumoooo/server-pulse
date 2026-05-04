// [분류] 필수 — Tailwind v3 디자인 토큰 설정
// CSS 변수 기반 Semantic token(색상·z-index·typography)을 Tailwind 클래스로 연결합니다.
// v4 마이그레이션 전까지 이 파일은 제거하거나 이동할 수 없습니다.
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  /* next-themes의 class 전략과 연동 */
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        /* Semantic 배경 */
        bg: {
          base:     "var(--color-bg-base)",
          surface:  "var(--color-bg-surface)",
          elevated: "var(--color-bg-elevated)",
          input:    "var(--color-bg-input)",
          overlay:  "var(--color-bg-overlay)",
        },
        /* Semantic 전경 */
        fg: {
          base:       "var(--color-fg-base)",
          muted:      "var(--color-fg-muted)",
          subtle:     "var(--color-fg-subtle)",
          "on-primary": "var(--color-fg-on-primary)",
          "on-danger": "var(--color-fg-on-danger)",
        },
        /* Semantic 보더 */
        border: {
          default: "var(--color-border-default)",
          subtle:  "var(--color-border-subtle)",
          focus:   "var(--color-border-focus)",
        },
        /* Interactive */
        interactive: {
          primary:         "var(--color-interactive-primary)",
          "primary-hover": "var(--color-interactive-primary-hover)",
          secondary:       "var(--color-interactive-secondary)",
          "secondary-fg":  "var(--color-interactive-secondary-fg)",
          danger:          "var(--color-interactive-danger)",
          "danger-hover":  "var(--color-interactive-danger-hover)",
          accent:          "var(--color-interactive-accent)",
          "accent-hover":  "var(--color-interactive-accent-hover)",
        },
        /* Status — 서버 상태 전용 */
        status: {
          ok: {
            bg:     "var(--status-ok-bg)",
            fg:     "var(--status-ok-fg)",
            border: "var(--status-ok-border)",
          },
          warn: {
            bg:     "var(--status-warn-bg)",
            fg:     "var(--status-warn-fg)",
            border: "var(--status-warn-border)",
          },
          error: {
            bg:     "var(--status-error-bg)",
            fg:     "var(--status-error-fg)",
            border: "var(--status-error-border)",
          },
          unknown: {
            bg:     "var(--status-unknown-bg)",
            fg:     "var(--status-unknown-fg)",
            border: "var(--status-unknown-border)",
          },
        },
        /* Severity — 알림 전용 */
        severity: {
          critical: {
            bg: "var(--severity-critical-bg)",
            fg: "var(--severity-critical-fg)",
          },
          warning: {
            bg: "var(--severity-warning-bg)",
            fg: "var(--severity-warning-fg)",
          },
          info: {
            bg: "var(--severity-info-bg)",
            fg: "var(--severity-info-fg)",
          },
        },
      },
      /* Z-index 레이어 */
      zIndex: {
        base:     "var(--z-base)",
        dropdown: "var(--z-dropdown)",
        sticky:   "var(--z-sticky)",
        overlay:  "var(--z-overlay)",
        modal:    "var(--z-modal)",
        popover:  "var(--z-popover)",
        toast:    "var(--z-toast)",
        tooltip:  "var(--z-tooltip)",
      },
      /* Typography */
      fontSize: {
        "token-xs":   "var(--font-size-xs)",
        "token-sm":   "var(--font-size-sm)",
        "token-base": "var(--font-size-base)",
        "token-lg":   "var(--font-size-lg)",
        "token-xl":   "var(--font-size-xl)",
        "token-2xl":  "var(--font-size-2xl)",
        "token-3xl":  "var(--font-size-3xl)",
      },
      fontWeight: {
        token_normal:   "var(--font-weight-normal)",
        token_medium:   "var(--font-weight-medium)",
        token_semibold: "var(--font-weight-semibold)",
        token_bold:     "var(--font-weight-bold)",
      },
      lineHeight: {
        token_tight:   "var(--line-height-tight)",
        token_snug:    "var(--line-height-snug)",
        token_normal:  "var(--line-height-normal)",
        token_relaxed: "var(--line-height-relaxed)",
      },
    },
  },
  plugins: [],
};

export default config;
