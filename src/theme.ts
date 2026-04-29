// =====================================================================
// QINO — Design Tokens
// Persistent design system. NOT mock data — these stay even when backend lands.
// =====================================================================

export const palette = {
  // Brand core
  midnight: "#0F1B26",
  steel: "#536A78",
  steelLight: "#7A8E9B",
  mist: "#B8CFD9",
  stone: "#F2EFEA",
  white: "#FFFFFF",
  ivory: "#F7F4EE",

  // Pastel accents (varied harmonious card backgrounds)
  paleBlue: "#DDE7EE",
  softBlush: "#F6DAD2",
  softLavender: "#E8DDF7",
  softPeach: "#F8E5D6",
  softSage: "#DCE8E2",

  // Deeper accents (chart series, dots, status)
  blushAccent: "#E8A89A",
  lavenderAccent: "#B89DD9",
  peachAccent: "#E8B894",
  sageAccent: "#9DB8A6",
  mistAccent: "#8AA8B5",

  // Text
  ink: "#0F1B26",
  textMuted: "#536A78",
  textDim: "#7A8E9B",

  // Lines
  hairline: "rgba(15,27,38,0.06)",
  hairlineMid: "rgba(15,27,38,0.10)",
} as const;

/**
 * Maps abstract data tokens (e.g. "softBlush") to actual color values.
 * Mock data references accents by KEY so the design layer stays swappable.
 */
export const accentByKey: Record<string, string> = {
  paleBlue: palette.paleBlue,
  softBlush: palette.softBlush,
  softLavender: palette.softLavender,
  softPeach: palette.softPeach,
  softSage: palette.softSage,
  stone: palette.stone,
  white: palette.white,
  mist: palette.mist,

  blushAccent: palette.blushAccent,
  lavenderAccent: palette.lavenderAccent,
  peachAccent: palette.peachAccent,
  sageAccent: palette.sageAccent,
  mistAccent: palette.mistAccent,
  midnight: palette.midnight,
  steel: palette.steel,
};

export const fonts = {
  title: "'Sora', system-ui, sans-serif",
  subtitle: "'Outfit', system-ui, sans-serif",
  body: "'Inter', system-ui, sans-serif",
} as const;

export const shadows = {
  card: "0 12px 28px rgba(15, 27, 38, 0.06)",
  hero: "0 20px 40px rgba(15, 27, 38, 0.10)",
  pressed: "0 8px 20px rgba(15,27,38,0.20)",
} as const;
