// =====================================================================
// MOCK DATA ONLY
// This will be replaced by Supabase/API data during backend integration.
// Backend replacement point:
//   GET /api/me/products?tier=standard → ProductStack
// Affiliate links should come from a server-side URL builder, never hardcoded.
// =====================================================================

import type { ProductStack } from "../types";

export const mockProductStack: ProductStack = {
  essentials: [
    {
      id: "p_cleanser",
      name: "Gentle cleanser",
      category: "cleanser",
      categoryLabel: "Cleanser",
      priority: "high",
      why: "Low-oil, slightly textured skin reads best with non-stripping cleanse.",
      tierAvailable: ["budget", "standard", "premium"],
      accentKey: "paleBlue",
    },
    {
      id: "p_moisturizer",
      name: "Hydrating moisturizer",
      category: "moisturizer",
      categoryLabel: "Moisturizer",
      priority: "high",
      why: "Hydration directly improves perceived skin evenness and lower-face softness.",
      tierAvailable: ["budget", "standard", "premium"],
      accentKey: "softLavender",
    },
    {
      id: "p_spf",
      name: "SPF 50",
      category: "spf",
      categoryLabel: "SPF",
      priority: "high",
      why: "Single highest-leverage skin item — prevents the texture and tone changes you're working to improve.",
      tierAvailable: ["budget", "standard", "premium"],
      accentKey: "softPeach",
    },
    {
      id: "p_lip",
      name: "Lip repair",
      category: "lip",
      categoryLabel: "Lip care",
      priority: "medium",
      why: "Smile polish is on your priority map; healthy lips frame the lower face.",
      tierAvailable: ["budget", "standard", "premium"],
      accentKey: "softBlush",
    },
  ],
  targeted: [
    {
      id: "p_texture",
      name: "Texture serum",
      category: "texture_serum",
      categoryLabel: "Texture",
      priority: "medium",
      why: "Skin appears slightly uneven and low-oil — barrier support beats aggressive exfoliation.",
      tierAvailable: ["standard", "premium"],
      accentKey: "softSage",
    },
    {
      id: "p_barrier",
      name: "Barrier support",
      category: "barrier",
      categoryLabel: "Barrier",
      priority: "medium",
      why: "Pairs with evening routine to maintain resilience as actives are introduced.",
      tierAvailable: ["standard", "premium"],
      accentKey: "paleBlue",
    },
    {
      id: "p_exfoliant",
      name: "Optional exfoliant",
      category: "exfoliant",
      categoryLabel: "Exfoliant",
      priority: "low",
      why: "Only if tolerated. Start at 1×/week and watch for irritation.",
      tierAvailable: ["budget", "standard", "premium"],
      accentKey: "softLavender",
    },
  ],
};
