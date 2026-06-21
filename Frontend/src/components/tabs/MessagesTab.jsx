import { useState, useRef, useEffect, useCallback } from "react";
import { SquarePen, Send, X, Search } from "lucide-react";
import { Avatar, FilterBar } from "../ui/index.jsx";
import { showToast } from "../ui/toast.js";
import { getInbox, getThread, sendMessage } from "../../api/messages.js";
import { getConnections } from "../../api/network.js";

function getInitials(name = "") {
  return name.trim().split(/\s+/).map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "?";
}

function formatTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000) return "Just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

function getConvCategory(conv) {
  const role = (conv.partnerRole || "").toLowerCase();
  if (role === "company") return "opportunities";
  return "contacts";
}

export default function MessagesTab({ currentUser }) {
  const myId = currentUser?.id;

  const [filter, setFilter] = useState("All");
  const [conversations, setConversations] = useState([]);
  const [activePartnerId, setActivePartnerId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showNewModal, setShowNewModal] = useState(false);
  const [loadingInbox, setLoadingInbox] = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Load inbox on mount
  useEffect(() => {
    async function load() {
      setLoadingInbox(true);
      try {
        const inbox = await getInbox();
        setConversations(
          inbox.map((item) => ({
            partnerId: item.user_id,
            partnerName: item.user_name,
            partnerRole: item.user_role,
            initials: getInitials(item.user_name),
            preview: item.last_message,
            time: formatTime(item.last_message_at),
            unread: item.unread_count > 0,
            unreadCount: item.unread_count,
            color: "primary",
          }))
        );
      } catch (err) {
        showToast(err.message || "Could not load messages", "error");
      } finally {
        setLoadingInbox(false);
      }
    }
    load();
  }, []);

  // Load thread when activePartnerId changes
  const loadThread = useCallback(async (partnerId) => {
    setLoadingThread(true);
    setMessages([]);
    try {
      const thread = await getThread(partnerId);
      setMessages(
        thread.map((msg) => ({
          id: msg.id,
          from: msg.sender_id === myId ? "self" : "other",
          text: msg.content,
          time: formatTime(msg.created_at),
        }))
      );
      // Mark conversation as read locally
      setConversations((prev) =>
        prev.map((c) => c.partnerId === partnerId ? { ...c, unread: false, unreadCount: 0 } : c)
      );
    } catch {
      setMessages([]);
    } finally {
      setLoadingThread(false);
    }
  }, [myId]);

  useEffect(() => {
    if (activePartnerId) loadThread(activePartnerId);
  }, [activePartnerId, loadThread]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const activeConv = conversations.find((c) => c.partnerId === activePartnerId);

  const filteredConvs = conversations.filter((conv) => {
    if (filter === "All") return true;
    if (filter === "Contacts") return getConvCategory(conv) === "contacts";
    if (filter === "Opportunities") return getConvCategory(conv) === "opportunities";
    return true;
  });

  async function handleSend() {
    const val = input.trim();
    if (!val || !activePartnerId || sending) return;
    setSending(true);
    const optimistic = { id: `tmp-${Date.now()}`, from: "self", text: val, time: "Just now" };
    setMessages((prev) => [...prev, optimistic]);
    setInput("");
    // Update conversation preview optimistically
    setConversations((prev) =>
      prev.map((c) => c.partnerId === activePartnerId ? { ...c, preview: val, time: "Just now" } : c)
    );
    try {
      await sendMessage(activePartnerId, val);
    } catch (err) {
      showToast(err.message || "Failed to send", "error");
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  }

  function openConversation(partnerId) {
    setActivePartnerId(partnerId);
  }

  function handleNewConversation(conv) {
    const exists = conversations.find((c) => c.partnerId === conv.partnerId);
    if (!exists) {
      setConversations((prev) => [conv, ...prev]);
    }
    setActivePartnerId(conv.partnerId);
    setShowNewModal(false);
  }

  const totalUnread = conversations.reduce((n, c) => n + (c.unreadCount || 0), 0);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", height: "100vh" }}>
      {/* ── Conversation list (left) ── */}
      <div style={{ borderRight: "1px solid var(--color-border)", background: "var(--color-surface)", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 16px 12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.1rem", color: "var(--color-text-1)" }}>Messages</h3>
            {totalUnread > 0 && (
              <span style={{ background: "#6C63FF", color: "white", borderRadius: 99, padding: "1px 7px", fontSize: "0.68rem", fontWeight: 700 }}>{totalUnread}</span>
            )}
          </div>
          <button
            onClick={() => setShowNewModal(true)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-2)", padding: 4, display: "flex", borderRadius: 6, transition: "color 0.15s, background 0.15s" }}
            title="New message"
            onMouseEnter={(e) => { e.currentTarget.style.color = "#6C63FF"; e.currentTarget.style.background = "rgba(108,99,255,0.08)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--color-text-2)"; e.currentTarget.style.background = "none"; }}
          >
            <SquarePen size={18} />
          </button>
        </div>

        <div style={{ padding: "0 16px 12px", borderBottom: "1px solid var(--color-border)", overflowX: "auto" }}>
          <FilterBar filters={["All", "Contacts", "Opportunities"]} active={filter} onChange={setFilter} />
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>
          {loadingInbox ? (
            <div style={{ padding: 20, color: "var(--color-text-3)", fontSize: "0.85rem", textAlign: "center" }}>Loading…</div>
          ) : filteredConvs.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--color-text-3)", fontSize: "0.85rem" }}>
              No messages yet.
            </div>
          ) : (
            filteredConvs.map((conv) => (
              <ConvRow
                key={conv.partnerId}
                conv={conv}
                active={activePartnerId === conv.partnerId}
                onClick={() => openConversation(conv.partnerId)}
              />
            ))
          )}
        </div>
      </div>

      {/* ── Chat pane (right) ── */}
      <div style={{ background: "var(--color-base)", display: "flex", flexDirection: "column" }}>
        {!activeConv ? (
          <EmptyChat onNew={() => setShowNewModal(true)} />
        ) : (
          <>
            {/* Chat header */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", borderBottom: "1px solid var(--color-border)", background: "var(--color-card)" }}>
              <Avatar initials={activeConv.initials} color={activeConv.color} size="sm" />
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--color-text-1)" }}>{activeConv.partnerName}</div>
                <div style={{ fontSize: "0.75rem", color: "#00D4AA", textTransform: "capitalize" }}>{activeConv.partnerRole}</div>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
              {loadingThread ? (
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-3)", fontSize: "0.85rem" }}>Loading…</div>
              ) : messages.length === 0 ? (
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-3)", fontSize: "0.85rem" }}>Start the conversation…</div>
              ) : (
                messages.map((msg) => <MessageBubble key={msg.id} msg={msg} />)
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={{ display: "flex", gap: 8, padding: "14px 20px", borderTop: "1px solid var(--color-border)", background: "var(--color-card)" }}>
              <input
                type="text"
                placeholder="Write a message…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{ flex: 1, background: "var(--color-surface)", border: "1.5px solid var(--color-border)", borderRadius: 24, padding: "10px 16px", color: "var(--color-text-1)", fontSize: "0.875rem", outline: "none", fontFamily: "var(--font-body)", transition: "border-color 0.15s" }}
                onFocus={(e) => (e.target.style.borderColor = "#6C63FF")}
                onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || sending}
                style={{ background: input.trim() && !sending ? "linear-gradient(135deg, #7B73FF, #00D4AA)" : "var(--color-border)", color: input.trim() && !sending ? "white" : "var(--color-text-3)", border: "none", borderRadius: "var(--radius-sm)", padding: "10px 16px", cursor: input.trim() && !sending ? "pointer" : "not-allowed", transition: "opacity 0.15s", display: "flex", alignItems: "center" }}
              >
                <Send size={18} />
              </button>
            </div>
          </>
        )}
      </div>

      {showNewModal && (
        <NewConversationModal
          myId={myId}
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
      style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", cursor: "pointer", transition: "background 0.12s", borderBottom: "1px solid var(--color-border)", borderLeft: active ? "2px solid #6C63FF" : "2px solid transparent", background: active ? "var(--color-card)" : "transparent" }}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "var(--color-card)"; }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
    >
      <div style={{ position: "relative", flexShrink: 0 }}>
        <Avatar initials={conv.initials} color={conv.color} size="sm" />
        {conv.unread && (
          <span style={{ position: "absolute", top: -2, right: -2, width: 9, height: 9, borderRadius: "50%", background: "#6C63FF", border: "2px solid var(--color-surface)" }} />
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: conv.unread ? 600 : 500, fontSize: "0.85rem", color: "var(--color-text-1)", display: "flex", justifyContent: "space-between" }}>
          {conv.partnerName}
          <span style={{ fontSize: "0.72rem", color: "var(--color-text-3)", fontWeight: 400 }}>{conv.time}</span>
        </div>
        <div style={{ fontSize: "0.78rem", color: conv.unread ? "var(--color-text-2)" : "var(--color-text-3)", fontWeight: conv.unread ? 500 : 400, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: 2 }}>
          {conv.preview}
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ msg }) {
  const isSelf = msg.from === "self";
  return (
    <div style={{ display: "flex", flexDirection: "column", maxWidth: "70%", alignSelf: isSelf ? "flex-end" : "flex-start", alignItems: isSelf ? "flex-end" : "flex-start" }}>
      <div style={{ background: isSelf ? "#6C63FF" : "var(--color-card)", border: isSelf ? "none" : "1px solid var(--color-border)", borderRadius: isSelf ? "16px 16px 4px 16px" : "16px 16px 16px 4px", padding: "10px 14px", fontSize: "0.875rem", color: isSelf ? "white" : "var(--color-text-1)", lineHeight: 1.5 }}>
        {msg.text}
      </div>
      <div style={{ fontSize: "0.7rem", color: "var(--color-text-3)", marginTop: 4 }}>{msg.time}</div>
    </div>
  );
}

function EmptyChat({ onNew }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, color: "var(--color-text-3)" }}>
      <div style={{ fontSize: "2.5rem" }}>💬</div>
      <div style={{ fontWeight: 600, fontSize: "1rem", color: "var(--color-text-1)" }}>Your messages</div>
      <div style={{ fontSize: "0.85rem", textAlign: "center", maxWidth: 280 }}>Select a conversation on the left, or start a new one.</div>
      <button onClick={onNew} style={{ background: "linear-gradient(135deg, #7B73FF, #00D4AA)", color: "white", border: "none", borderRadius: "var(--radius-sm)", padding: "9px 22px", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer", marginTop: 4 }}>
        New Message
      </button>
    </div>
  );
}

function NewConversationModal({ myId, onClose, onCreate }) {
  const [search, setSearch] = useState("");
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getConnections()
      .then((conns) => {
        setPeople(
          conns
            .filter((u) => u.id !== myId)
            .map((u) => ({
              id: u.id,
              name: u.name,
              role: u.role,
              initials: getInitials(u.name),
            }))
        );
      })
      .catch(() => setPeople([]))
      .finally(() => setLoading(false));
  }, [myId]);

  const filtered = people.filter(
    (p) => !search || p.name.toLowerCase().includes(search.toLowerCase())
  );

  function handleSelect(person) {
    onCreate({
      partnerId: person.id,
      partnerName: person.name,
      partnerRole: person.role,
      initials: person.initials,
      preview: "Start a conversation…",
      time: "",
      unread: false,
      unreadCount: 0,
      color: "primary",
    });
    showToast(`Started conversation with ${person.name}`);
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="fade-in" style={{ background: "var(--color-card)", borderRadius: "var(--radius-xl)", padding: 24, width: "100%", maxWidth: 420, boxShadow: "0 20px 60px rgba(0,0,0,0.15)", maxHeight: "80vh", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", color: "var(--color-text-1)" }}>New Message</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-3)", display: "flex" }}><X size={20} /></button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--color-surface)", border: "1.5px solid var(--color-border)", borderRadius: "var(--radius-sm)", padding: "8px 12px", marginBottom: 12 }}>
          <Search size={15} style={{ color: "var(--color-text-3)", flexShrink: 0 }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search connections…" autoFocus style={{ flex: 1, background: "none", border: "none", outline: "none", color: "var(--color-text-1)", fontSize: "0.875rem", fontFamily: "var(--font-body)" }} />
        </div>

        <div style={{ overflowY: "auto", flex: 1 }}>
          {loading ? (
            <div style={{ padding: 20, textAlign: "center", color: "var(--color-text-3)", fontSize: "0.85rem" }}>Loading connections…</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "24px", color: "var(--color-text-3)", fontSize: "0.85rem" }}>
              {people.length === 0 ? "You have no connections yet. Connect with people to message them." : `No connections found for "${search}"`}
            </div>
          ) : (
            filtered.map((person) => (
              <div key={person.id} onClick={() => handleSelect(person)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 8px", borderRadius: "var(--radius-sm)", cursor: "pointer", transition: "background 0.12s" }} onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-surface)")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                <Avatar initials={person.initials} color="primary" size="sm" />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 500, fontSize: "0.875rem", color: "var(--color-text-1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{person.name}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--color-text-3)", textTransform: "capitalize" }}>{person.role}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
