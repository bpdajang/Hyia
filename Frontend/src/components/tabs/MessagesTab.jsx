import { useState, useRef, useEffect } from "react";
import { SquarePen, Send } from "lucide-react";
import { Avatar, FilterBar } from "../ui/index.jsx";
import { CONVERSATIONS } from "../../data/index.js";

export default function MessagesTab() {
  const [filter, setFilter] = useState("All");
  const [activeConvId, setActiveConvId] = useState(null);
  const [conversations, setConversations] = useState(CONVERSATIONS);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const activeConv = conversations.find((c) => c.id === activeConvId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConv?.messages]);

  function sendMessage() {
    const val = input.trim();
    if (!val || !activeConvId) return;
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConvId
          ? {
              ...c,
              messages: [
                ...c.messages,
                { id: Date.now(), from: "self", text: val, time: "Just now" },
              ],
            }
          : c,
      ),
    );
    setInput("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") sendMessage();
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 320px",
        height: "calc(100vh - var(--nav-h))",
      }}
    >
      {/* Main pane */}
      <div
        style={{
          background: "var(--color-base)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {!activeConv ? (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-text-3)",
              gap: 12,
              fontSize: "0.875rem",
            }}
          >
            <p>Select a conversation to start messaging</p>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "16px 20px",
                borderBottom: "1px solid var(--color-border)",
                background: "var(--color-surface)",
              }}
            >
              <Avatar
                initials={activeConv.initials}
                color={activeConv.color}
                size="sm"
              />
              <div>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    color: "var(--color-text-1)",
                  }}
                >
                  {activeConv.name}
                </div>
                <div style={{ fontSize: "0.75rem", color: "#00D4AA" }}>
                  {activeConv.meta}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: 20,
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              {activeConv.messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    maxWidth: "70%",
                    alignSelf: msg.from === "self" ? "flex-end" : "flex-start",
                    alignItems: msg.from === "self" ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      background:
                        msg.from === "self"
                          ? "rgba(108,99,255,0.15)"
                          : "var(--color-card)",
                      border: `1px solid ${msg.from === "self" ? "rgba(108,99,255,0.3)" : "var(--color-border)"}`,
                      borderRadius: 16,
                      padding: "10px 14px",
                      fontSize: "0.875rem",
                      color: "var(--color-text-1)",
                      lineHeight: 1.5,
                    }}
                  >
                    {msg.text}
                  </div>
                  <div
                    style={{
                      fontSize: "0.7rem",
                      color: "var(--color-text-3)",
                      marginTop: 4,
                    }}
                  >
                    {msg.time}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div
              style={{
                display: "flex",
                gap: 8,
                padding: "16px 20px",
                borderTop: "1px solid var(--color-border)",
                background: "var(--color-surface)",
              }}
            >
              <input
                type="text"
                placeholder="Write a message…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{
                  flex: 1,
                  background: "var(--color-card)",
                  border: "1.5px solid var(--color-border)",
                  borderRadius: 24,
                  padding: "10px 16px",
                  color: "var(--color-text-1)",
                  fontSize: "0.875rem",
                  outline: "none",
                  fontFamily: "var(--font-body)",
                }}
              />
              <button
                onClick={sendMessage}
                style={{
                  background: "linear-gradient(135deg, #7B73FF, #00D4AA)",
                  color: "white",
                  border: "none",
                  borderRadius: "var(--radius-sm)",
                  padding: "10px 16px",
                  cursor: "pointer",
                  transition: "opacity 0.2s",
                  display: "flex",
                  alignItems: "center",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div
        style={{
          borderRight: "1px solid var(--color-border)",
          background: "var(--color-surface)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 16px 0",
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "1.1rem",
              color: "var(--color-text-1)",
            }}
          >
            Messages
          </h3>
          <button
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--color-text-2)",
              padding: 4,
              display: "flex",
              alignItems: "center",
            }}
          >
            <SquarePen size={18} />
          </button>
        </div>

        <div
          style={{
            padding: "12px 16px",
            borderBottom: "1px solid var(--color-border)",
            overflowX: "auto",
          }}
        >
          <FilterBar
            filters={["All", "Contacts", "Opportunities", "Other"]}
            active={filter}
            onChange={setFilter}
          />
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>
          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setActiveConvId(conv.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "14px 16px",
                cursor: "pointer",
                transition: "background 0.15s",
                borderBottom: "1px solid var(--color-border)",
                borderLeft:
                  activeConvId === conv.id
                    ? "2px solid #6C63FF"
                    : "2px solid transparent",
                background:
                  activeConvId === conv.id
                    ? "var(--color-card)"
                    : "transparent",
              }}
              onMouseEnter={(e) => {
                if (activeConvId !== conv.id)
                  e.currentTarget.style.background = "var(--color-card)";
              }}
              onMouseLeave={(e) => {
                if (activeConvId !== conv.id)
                  e.currentTarget.style.background = "transparent";
              }}
            >
              <Avatar initials={conv.initials} color={conv.color} size="sm" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontWeight: 500,
                    fontSize: "0.85rem",
                    color: "var(--color-text-1)",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  {conv.name}
                  <span
                    style={{
                      fontSize: "0.72rem",
                      color: "var(--color-text-3)",
                      fontWeight: 400,
                    }}
                  >
                    {conv.time}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "0.78rem",
                    color: conv.unread
                      ? "var(--color-text-2)"
                      : "var(--color-text-3)",
                    fontWeight: conv.unread ? 500 : 400,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    marginTop: 2,
                  }}
                >
                  {conv.preview}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
