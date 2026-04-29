// =====================================================================
// QINO — Coach Screen
// Props-driven. Consumes CoachState + safety note text.
// =====================================================================

import { useState } from "react";
import { Send, Sparkle } from "lucide-react";
import type { CoachState } from "../types";
import { palette, fonts, shadows } from "../theme";
import { Eyebrow, SectionHeading, QinoMark, resolveAccent } from "../components/primitives";
import { getIcon } from "../iconRegistry";

interface CoachScreenProps {
  state: CoachState;
  safetyNote: string;
  fallbackReply: string;
  subtitle: string;
}

export const CoachScreen = ({
  state,
  safetyNote,
  fallbackReply,
  subtitle,
}: CoachScreenProps) => {
  const [messages, setMessages] = useState(state.messages);
  const [input, setInput] = useState("");

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [
      ...m,
      { id: `u_${Date.now()}`, role: "user", text },
      { id: `q_${Date.now()}`, role: "qino", text: fallbackReply },
    ]);
    setInput("");
  };

  return (
    <div className="flex flex-col" style={{ minHeight: "calc(100vh - 140px)" }}>
      <div className="px-5 pt-1 pb-3">
        <div className="flex items-center gap-2">
          <QinoMark size={16} color={palette.midnight} />
          <Eyebrow>QINO Coach</Eyebrow>
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

      <div className="px-5">
        <SectionHeading>Suggested</SectionHeading>
        <div className="grid grid-cols-2 gap-2.5">
          {state.suggestedPrompts.map((p) => {
            const Icon = getIcon(p.iconKey);
            const bg = resolveAccent(p.accentKey);
            return (
              <button
                key={p.id}
                onClick={() => send(p.text)}
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
                  <QinoMark size={12} color={palette.midnight} />
                  <span
                    className="text-[10px] uppercase"
                    style={{
                      fontFamily: fonts.subtitle,
                      fontWeight: 600,
                      letterSpacing: "0.1em",
                      color: palette.textMuted,
                    }}
                  >
                    QINO
                  </span>
                </div>
              )}
              <p className="text-[13.5px] leading-[1.5]" style={{ fontWeight: 400 }}>
                {m.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="px-5 mt-5 space-y-3 pb-2">
        <div
          className="px-4 py-3 rounded-[16px] flex items-start gap-2.5"
          style={{ background: palette.stone, border: `1px solid ${palette.hairline}` }}
        >
          <Sparkle size={11} color={palette.textMuted} strokeWidth={1.5} className="mt-0.5 flex-shrink-0" />
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
            onKeyDown={(e) => e.key === "Enter" && send(input)}
            placeholder="Ask QINO..."
            className="flex-1 text-[13.5px] bg-transparent outline-none"
            style={{ fontFamily: fonts.body, fontWeight: 400, color: palette.ink }}
          />
          <button
            onClick={() => send(input)}
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
