// =====================================================================
// QINO — Coach Screen
// Grounded chat surface. Suggested prompts return real canned replies
// keyed off the user's analysis. Free-text inputs return a fallback
// (real LLM lands in iteration 8).
// =====================================================================

import { useState } from "react";
import { Send, Sparkle } from "lucide-react";
import type { CoachState } from "../types";
import { palette, fonts, shadows } from "../theme";
import {
  Eyebrow,
  SectionHeading,
  Card,
  QinoMark,
  resolveAccent,
} from "../components/primitives";
import { getIcon } from "../iconRegistry";

interface CoachContextItem {
  iconKey: string;
  label: string;
  value: string;
  accentKey: string;
}

interface CoachScreenProps {
  state: CoachState;
  /** Map of responseKey → grounded response text. */
  responses: Record<string, string>;
  /** "What I know about you" context items. */
  contextEyebrow: string;
  contextItems: CoachContextItem[];
  safetyNote: string;
  fallbackReply: string;
  subtitle: string;
}

export const CoachScreen = ({
  state,
  responses,
  contextEyebrow,
  contextItems,
  safetyNote,
  fallbackReply,
  subtitle,
}: CoachScreenProps) => {
  const [messages, setMessages] = useState(state.messages);
  const [input, setInput] = useState("");

  /**
   * If the prompt has a `responseKey` and we have a canned response for it,
   * return that; otherwise fall back to the generic prototype reply.
   */
  const replyFor = (text: string, responseKey?: string): string => {
    if (responseKey && responses[responseKey]) return responses[responseKey];
    return fallbackReply;
  };

  const sendPrompt = (text: string, responseKey?: string) => {
    if (!text.trim()) return;
    const reply = replyFor(text, responseKey);
    setMessages((m) => [
      ...m,
      { id: `u_${Date.now()}`, role: "user", text },
      { id: `q_${Date.now() + 1}`, role: "qino", text: reply },
    ]);
    setInput("");
  };

  return (
    <div className="flex flex-col" style={{ minHeight: "calc(100vh - 140px)" }}>
      {/* Header */}
      <div className="px-5 pt-1 pb-3">
        <div className="flex items-center gap-2">
          <QinoMark size={20} />
          <Eyebrow>Coach</Eyebrow>
        </div>
        <h1
          className="mt-1 text-[26px] leading-tight"
          style={{
            fontFamily: fonts.title,
            fontWeight: 600,
            letterSpacing: "-0.03em",
            color: palette.ink,
          }}
        >
          Ask QINO
        </h1>
        <p
          className="text-[12.5px] mt-1.5"
          style={{ fontFamily: fonts.body, fontWeight: 400, color: palette.textMuted }}
        >
          {subtitle}
        </p>
      </div>

      {/* "What I know about you" context */}
      <div className="px-5">
        <SectionHeading>{contextEyebrow}</SectionHeading>
        <Card padding="p-1" radius="rounded-[20px]">
          {contextItems.map((item, i, arr) => {
            const Icon = getIcon(item.iconKey);
            const accent = resolveAccent(item.accentKey);
            return (
              <div
                key={item.label}
                className="flex items-center gap-3 px-3 py-3"
                style={{
                  borderBottom:
                    i !== arr.length - 1 ? `1px solid ${palette.hairline}` : "none",
                }}
              >
                <div
                  className="w-9 h-9 rounded-[12px] flex items-center justify-center flex-shrink-0"
                  style={{ background: accent }}
                >
                  <Icon size={14} color={palette.midnight} strokeWidth={1.6} />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-[10.5px]"
                    style={{
                      fontFamily: fonts.subtitle,
                      fontWeight: 500,
                      color: palette.textMuted,
                    }}
                  >
                    {item.label}
                  </p>
                  <p
                    className="text-[12.5px] mt-0.5"
                    style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.ink }}
                  >
                    {item.value}
                  </p>
                </div>
              </div>
            );
          })}
        </Card>
      </div>

      {/* Suggested prompts */}
      <div className="px-5 mt-5">
        <SectionHeading>Suggested</SectionHeading>
        <div className="grid grid-cols-2 gap-2.5">
          {state.suggestedPrompts.map((p) => {
            const Icon = getIcon(p.iconKey);
            const bg = resolveAccent(p.accentKey);
            // CoachPrompt may carry an optional responseKey from data
            const responseKey = (p as { responseKey?: string }).responseKey;
            return (
              <button
                key={p.id}
                onClick={() => sendPrompt(p.text, responseKey)}
                className="rounded-[20px] p-4 text-left active:scale-[0.98] transition-transform"
                style={{
                  background: bg,
                  border: `1px solid ${palette.hairline}`,
                  boxShadow: shadows.card,
                }}
              >
                <div
                  className="w-9 h-9 rounded-[12px] flex items-center justify-center mb-2.5"
                  style={{ background: "rgba(255,255,255,0.65)" }}
                >
                  <Icon size={15} color={palette.midnight} strokeWidth={1.6} />
                </div>
                <p
                  className="text-[12px] leading-snug"
                  style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.ink }}
                >
                  {p.text}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Conversation */}
      <div className="px-5 mt-6 space-y-3 flex-1">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className="max-w-[88%] px-4 py-3 rounded-[20px]"
              style={{
                background: m.role === "user" ? palette.midnight : palette.white,
                color: m.role === "user" ? palette.stone : palette.ink,
                border: m.role === "user" ? "none" : `1px solid ${palette.hairline}`,
                boxShadow: m.role === "user" ? "none" : shadows.card,
                borderBottomRightRadius: m.role === "user" ? 6 : 20,
                borderBottomLeftRadius: m.role === "qino" ? 6 : 20,
                fontFamily: fonts.body,
              }}
            >
              {m.role === "qino" && (
                <div className="flex items-center gap-1.5 mb-1.5">
                  <QinoMark size={14} />
                </div>
              )}
              <p className="text-[13.5px] leading-[1.5]" style={{ fontWeight: 400 }}>
                {m.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer: safety + input */}
      <div className="px-5 mt-5 space-y-3 pb-2">
        <div
          className="px-4 py-3 rounded-[16px] flex items-start gap-2.5"
          style={{ background: palette.stone, border: `1px solid ${palette.hairline}` }}
        >
          <Sparkle
            size={11}
            color={palette.textMuted}
            strokeWidth={1.5}
            className="mt-0.5 flex-shrink-0"
          />
          <p
            className="text-[10.5px] leading-relaxed"
            style={{ fontFamily: fonts.body, fontWeight: 400, color: palette.textMuted }}
          >
            {safetyNote}
          </p>
        </div>
        <div
          className="flex items-center gap-2 rounded-full px-4 py-2"
          style={{
            background: palette.white,
            border: `1px solid ${palette.hairlineMid}`,
            boxShadow: shadows.card,
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendPrompt(input)}
            placeholder="Ask QINO..."
            className="flex-1 text-[13.5px] bg-transparent outline-none"
            style={{ fontFamily: fonts.body, fontWeight: 400, color: palette.ink }}
          />
          <button
            onClick={() => sendPrompt(input)}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: palette.midnight }}
          >
            <Send size={13} color={palette.mist} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </div>
  );
};
