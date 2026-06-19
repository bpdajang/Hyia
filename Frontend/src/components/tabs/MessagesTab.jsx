import { useState, useRef, useEffect } from "react";
import { SquarePen, Send, X, Search } from "lucide-react";
import { Avatar, FilterBar } from "../ui/index.jsx";
import { showToast } from "../ui/toast.js";
import { CONVERSATIONS, PROFILES } from "../../data/index.js";

// Classify a conversation so the filter bar works
function getConvCategory(conv) {
  const name = conv.name.toLowerCase();
  const meta = (conv.meta || "").toLowerCase();
  if (name.includes("recruit") || meta.includes("recruit") || meta.includes("hiring"))
    return "opportunities";
  return "contacts";
}

export default function MessagesTab() {
  const [filter, setFilter] = useState("All");
  const [activeConvId, setActiveConvId] = useState(null);
  const [conversations, setConversations] = useState(CONVERSATIONS);
  const [input, setInput] = useState("");
  const [showNewModal, setShowNewModal] = useState(false);
  const messagesEndRef = useRef(null);

  const activeConv = conversations.find((c) => c.id === activeConvId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConv?.messages]);

  const filteredConvs = conversations.filter((conv) => {
    if (filter === "All") return true;
    if (filter === "Contacts") return getConvCategory(conv) === "contacts";
    if (filter === "Opportunities") return getConvCategory(conv) === "opportunities";
    if (filter === "Other") return false;
    return true;
  });

  function selectConversation(id) {
    setActiveConvId(id);
    // Mark as read when opened
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: false } : c)),
    );
  }

  function sendMessage() {
    const val = input.trim();
    if (!val || !activeConvId) return;
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConvId
          ? {
              ...c,
              preview: val,
              time: "Now",
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
    if (e.key === "Enter" && !e.shiftKey) sendMessage();
  }

  function handleNewConversation(conv) {
    // If the conversation already exists just open it
    const existing = conversations.find((c) => c.name === conv.name);
    if (existing) {
      selectConversation(existing.id);
      return;
    }
    setConversations((prev) => [conv, ...prev]);
    setActiveConvId(conv.id);
  }

  const totalUnread = conversations.filter((c) => c.unread).length;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "320px 1fr",
        height: "100vh",
      }}
    >
      {/* ── Conversation list (left) ────────────────────────────── */}
      <div
        style={{
          borderRight: "1px solid var(--color-border)",
          background: "var(--color-surface)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 16px 12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
            {totalUnread > 0 && (
              <span
                style={{
                  background: "#6C63FF",
                  color: "white",
                  borderRadius: 99,
                  padding: "1px 7px",
                  fontSize: "0.68rem",
                  fontWeight: 700,
                }}
              >
                {totalUnread}
              </span>
            )}
          </div>
          <button
            onClick={() => setShowNewModal(true)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--color-text-2)",
              padding: 4,
              display: "flex",
              alignItems: "center",
              borderRadius: 6,
              transition: "color 0.15s, background 0.15s",
            }}
            title="New message"
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#6C63FF";
              e.currentTarget.style.background = "rgba(108,99,255,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--color-text-2)";
              e.currentTarget.style.background = "none";
            }}
          >
            <SquarePen size={18} />
          </button>
        </div>

        {/* Filters */}
        <div
          style={{
            padding: "0 16px 12px",
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

        {/* Conversation rows */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {filteredConvs.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--color-text-3)", fontSize: "0.85rem" }}>
              No {filter === "All" ? "" : filter.toLowerCase() + " "}conversations yet.
            </div>
          ) : (
            filteredConvs.map((conv) => (
              <ConvRow
                key={conv.id}
                conv={conv}
                active={activeConvId === conv.id}
                onClick={() => selectConversation(conv.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* ── Chat pane (right) ───────────────────────────────────── */}
      <div
        style={{
          background: "var(--color-base)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {!activeConv ? (
          <EmptyChat onNew={() => setShowNewModal(true)} />
        ) : (
          <>
            {/* Chat header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "16px 20px",
                borderBottom: "1px solid var(--color-border)",
                background: "var(--color-card)",
              }}
            >
              <Avatar initials={activeConv.initials} color={activeConv.color} size="sm" />
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--color-text-1)" }}>
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
                gap: 14,
              }}
            >
              {activeConv.messages.length === 0 ? (
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-3)", fontSize: "0.85rem" }}>
                  Start the conversation…
                </div>
              ) : (
                activeConv.messages.map((msg) => (
                  <MessageBubble key={msg.id} msg={msg} />
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div
              style={{
                display: "flex",
                gap: 8,
                padding: "14px 20px",
                borderTop: "1px solid var(--color-border)",
                background: "var(--color-card)",
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
                  background: "var(--color-surface)",
                  border: "1.5px solid var(--color-border)",
                  borderRadius: 24,
                  padding: "10px 16px",
                  color: "var(--color-text-1)",
                  fontSize: "0.875rem",
                  outline: "none",
                  fontFamily: "var(--font-body)",
                  transition: "border-color 0.15s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#6C63FF")}
                onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim()}
                style={{
                  background: input.trim()
                    ? "linear-gradient(135deg, #7B73FF, #00D4AA)"
                    : "var(--color-border)",
                  color: input.trim() ? "white" : "var(--color-text-3)",
                  border: "none",
                  borderRadius: "var(--radius-sm)",
                  padding: "10px 16px",
                  cursor: input.trim() ? "pointer" : "not-allowed",
                  transition: "opacity 0.15s",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Send size={18} />
              </button>
            </div>
          </>
        )}
      </div>

      {/* ── New conversation modal ──────────────────────────────── */}
      {showNewModal && (
        <NewConversationModal
          conversations={conversations}
          onClose={() => setShowNewModal(false)}
          onCreate={handleNewConversation}
        />
      )}
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function ConvRow({ conv, active, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "14px 16px",
        cursor: "pointer",
        transition: "background 0.12s",
        borderBottom: "1px solid var(--color-border)",
        borderLeft: active ? "2px solid #6C63FF" : "2px solid transparent",
        background: active ? "var(--color-card)" : "transparent",
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.background = "var(--color-card)";
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.background = "transparent";
      }}
    >
      <div style={{ position: "relative", flexShrink: 0 }}>
        <Avatar initials={conv.initials} color={conv.color} size="sm" />
        {conv.unread && (
          <span
            style={{
              position: "absolute",
              top: -2,
              right: -2,
              width: 9,
              height: 9,
              borderRadius: "50%",
              background: "#6C63FF",
              border: "2px solid var(--color-surface)",
            }}
          />
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontWeight: conv.unread ? 600 : 500,
            fontSize: "0.85rem",
            color: "var(--color-text-1)",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {conv.name}
          <span style={{ fontSize: "0.72rem", color: "var(--color-text-3)", fontWeight: 400 }}>
            {conv.time}
          </span>
        </div>
        <div
          style={{
            fontSize: "0.78rem",
            color: conv.unread ? "var(--color-text-2)" : "var(--color-text-3)",
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
  );
}

function MessageBubble({ msg }) {
  const isSelf = msg.from === "self";
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        maxWidth: "70%",
        alignSelf: isSelf ? "flex-end" : "flex-start",
        alignItems: isSelf ? "flex-end" : "flex-start",
      }}
    >
      <div
        style={{
          background: isSelf ? "#6C63FF" : "var(--color-card)",
          border: isSelf ? "none" : "1px solid var(--color-border)",
          borderRadius: isSelf ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
          padding: "10px 14px",
          fontSize: "0.875rem",
          color: isSelf ? "white" : "var(--color-text-1)",
          lineHeight: 1.5,
        }}
      >
        {msg.text}
      </div>
      <div style={{ fontSize: "0.7rem", color: "var(--color-text-3)", marginTop: 4 }}>
        {msg.time}
      </div>
    </div>
  );
}

function EmptyChat({ onNew }) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        color: "var(--color-text-3)",
      }}
    >
      <div style={{ fontSize: "2.5rem" }}>💬</div>
      <div style={{ fontWeight: 600, fontSize: "1rem", color: "var(--color-text-1)" }}>
        Your messages
      </div>
      <div style={{ fontSize: "0.85rem", textAlign: "center", maxWidth: 280 }}>
        Select a conversation on the left, or start a new one.
      </div>
      <button
        onClick={onNew}
        style={{
          background: "linear-gradient(135deg, #7B73FF, #00D4AA)",
          color: "white",
          border: "none",
          borderRadius: "var(--radius-sm)",
          padding: "9px 22px",
          fontWeight: 600,
          fontSize: "0.85rem",
          cursor: "pointer",
          marginTop: 4,
        }}
      >
        New Message
      </button>
    </div>
  );
}

function NewConversationModal({ conversations, onClose, onCreate }) {
  const [search, setSearch] = useState("");

  const people = Object.values(PROFILES).filter(
    (p) =>
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.title.toLowerCase().includes(search.toLowerCase()),
  );

  function handleSelect(person) {
    const existing = conversations.find((c) => c.name === person.name);
    if (existing) {
      onCreate(existing);
      showToast(`Opened conversation with ${person.name}`);
    } else {
      onCreate({
        id: `conv-${Date.now()}`,
        initials: person.initials,
        name: person.name,
        meta: person.title,
        time: "Now",
        preview: "Start a conversation…",
        unread: false,
        color: person.color || "primary",
        messages: [],
      });
      showToast(`Started conversation with ${person.name}`);
    }
    onClose();
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        zIndex: 500,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="fade-in"
        style={{
          background: "var(--color-card)",
          borderRadius: "var(--radius-xl)",
          padding: 24,
          width: "100%",
          maxWidth: 420,
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", color: "var(--color-text-1)" }}>
            New Message
          </h3>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-3)", display: "flex" }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "var(--color-surface)",
            border: "1.5px solid var(--color-border)",
            borderRadius: "var(--radius-sm)",
            padding: "8px 12px",
            marginBottom: 12,
          }}
        >
          <Search size={15} style={{ color: "var(--color-text-3)", flexShrink: 0 }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search people…"
            autoFocus
            style={{
              flex: 1,
              background: "none",
              border: "none",
              outline: "none",
              color: "var(--color-text-1)",
              fontSize: "0.875rem",
              fontFamily: "var(--font-body)",
            }}
          />
        </div>

        {/* People list */}
        <div style={{ overflowY: "auto", flex: 1 }}>
          {people.length === 0 ? (
            <div style={{ textAlign: "center", padding: "24px", color: "var(--color-text-3)", fontSize: "0.85rem" }}>
              No people found for "{search}"
            </div>
          ) : (
            people.map((person) => (
              <div
                key={person.id}
                onClick={() => handleSelect(person)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 8px",
                  borderRadius: "var(--radius-sm)",
                  cursor: "pointer",
                  transition: "background 0.12s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-surface)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <Avatar initials={person.initials} color={person.color || "primary"} size="sm" />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 500, fontSize: "0.875rem", color: "var(--color-text-1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {person.name}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--color-text-3)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {person.title}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
