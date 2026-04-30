// =====================================================================
// QINO — Coach Screen (iteration 8B)
// Real Claude Haiku-backed chat. Suggested prompts and free text both
// go through `sendCoachMessage`, which streams the reply back.
// History is persisted in coach_messages and rehydrated on mount.
// =====================================================================

import { useEffect, useRef, useState } from "react";
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
import { fetchCoachHistory, sendCoachMessage } from "../data/qinoApi";

interface CoachContextItem {
  iconKey: string;
  label: string;
  value: string;
  accentKey: string;
}

interface CoachScreenProps {
  state: CoachState;
  /** "What I know about you" context items. */
  contextEyebrow: string;
  contextItems: CoachContextItem[];
  safetyNote: string;
  subtitle: string;
}

interface UiMessage {
  id: string;
  role: "user" | "qino";
  text: string;
  /** True while assistant text is still streaming in. */
  generating?: boolean;
}

export const CoachScreen = ({
  state,
  contextEyebrow,
  contextItems,
  safetyNote,
  subtitle,
}: CoachScreenProps) => {
  const [messages, setMessages] = useState<UiMessage[]>(
    state.messages.map((m) => ({ id: m.id, role: m.role, text: m.text }))
  );
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const hydratedRef = useRef(false);

  // ----- Load persisted history on mount -----
  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    let cancelled = false;
    (async () => {
      const history = await fetchCoachHistory(50);
      if (cancelled) return;
      if (history.length > 0) {
        setMessages(
          history.map((h) => ({ id: h.id, role: h.role, text: h.content }))
        );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const sendPrompt = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    const userMsgId = `u_${Date.now()}`;
    const placeholderId = `q_${Date.now() + 1}`;

    setMessages((m) => [
      ...m,
      { id: userMsgId, role: "user", text: trimmed },
      { id: placeholderId, role: "qino", text: "", generating: true },
    ]);
    setInput("");
    setSending(true);

    try {
      const { replyId } = await sendCoachMessage(trimmed, (delta) => {
        setMessages((m) =>
          m.map((msg) =>
            msg.id === placeholderId
              ? { ...msg, text: msg.text + delta }
              : msg
          )
        );
      });
      // Swap placeholder id for the persisted reply id; clear generating.
      setMessages((m) =>
        m.map((msg) =>
          msg.id === placeholderId
            ? { ...msg, id: replyId, generating: false }
            : msg
        )
      );
    } catch {
      setMessages((m) =>
        m.map((msg) =>
          msg.id === placeholderId
            ? {
                ...msg,
                text: "Sorry — try again in a moment.",
                generating: false,
              }
            : msg
        )
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col" style={{ minHeight: "calc(100vh - 140px)" }}>
      {/* Header */}
      <div className="px-5 pt-1 pb-3">
        <div className="flex items-center gap-2">
          <QinoMark size={28} />
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
            return (
              <button
                key={p.id}
                onClick={() => sendPrompt(p.text)}
                disabled={sending}
                className="rounded-[20px] p-4 text-left active:scale-[0.98] transition-transform disabled:opacity-50"
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
              {m.role === "qino" && m.generating && m.text.length === 0 ? (
                <TypingDots />
              ) : (
                <p className="text-[13.5px] leading-[1.5]" style={{ fontWeight: 400 }}>
                  {m.text}
                </p>
              )}
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
            disabled={sending}
            placeholder="Ask QINO..."
            className="flex-1 text-[13.5px] bg-transparent outline-none disabled:opacity-50"
            style={{ fontFamily: fonts.body, fontWeight: 400, color: palette.ink }}
          />
          <button
            onClick={() => sendPrompt(input)}
            disabled={sending}
            className="w-9 h-9 rounded-full flex items-center justify-center disabled:opacity-50"
            style={{ background: palette.midnight }}
          >
            <Send size={13} color={palette.mist} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </div>
  );
};

/** Three subtly animated dots used inside the assistant bubble while streaming. */
const TypingDots = () => (
  <div className="flex items-center gap-1 py-1">
    <style>{`
      @keyframes qinoTypingDot {
        0%, 80%, 100% { opacity: 0.25; transform: translateY(0); }
        40% { opacity: 1; transform: translateY(-2px); }
      }
    `}</style>
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="block w-1.5 h-1.5 rounded-full"
        style={{
          background: palette.textMuted,
          animation: `qinoTypingDot 1.2s ${i * 0.18}s infinite ease-in-out`,
        }}
      />
    ))}
  </div>
);
