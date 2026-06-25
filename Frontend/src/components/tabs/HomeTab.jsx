import { useState, useEffect, useRef } from "react";
import { useIsMobile } from "../../hooks/useIsMobile.js";
import {
  Avatar,
  SkillPill,
  FilterBar,
  SectionCard,
  SectionTitle,
  AiTag,
  PostBadge,
  SkeletonPost,
} from "../ui/index.jsx";
import { showToast } from "../ui/toast.js";
import {
  FEED_POSTS,
  SUGGESTED_CONNECTIONS,
  TRENDING,
} from "../../data/index.js";
import {
  Heart,
  MessageCircle,
  Share2,
  Image,
  MoreHorizontal,
  MapPin,
  Clock,
  DollarSign,
  X,
  AtSign,
  Highlighter,
  Bold,
  Trash2,
} from "lucide-react";

// ── Right Sidebar ──────────────────────────────────────────────────────────────

function RightSidebar({ onViewProfile, onTagFilter }) {
  return (
    <aside style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SectionCard>
        <SectionTitle>Trending on Hyia</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {TRENDING.map((t) => (
            <div
              key={t.num}
              onClick={() => onTagFilter(t.tag)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                cursor: "pointer",
                borderRadius: 6,
                padding: "4px 6px",
                margin: "-4px -6px",
                transition: "background 0.12s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--color-surface)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "0.7rem",
                  color: "var(--color-text-3)",
                  width: 20,
                }}
              >
                {t.num}
              </span>
              <div>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: "0.82rem",
                    color: "var(--color-text-1)",
                  }}
                >
                  {t.tag}
                </div>
                <div
                  style={{ fontSize: "0.72rem", color: "var(--color-text-3)" }}
                >
                  {t.count}
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard>
        <SectionTitle extra={<AiTag />}>Mentor Match</SectionTitle>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "2.8rem",
              color: "#00D4AA",
              lineHeight: 1,
              marginBottom: 8,
            }}
          >
            94<span style={{ fontSize: "1.2rem" }}>%</span>
          </div>
          <div
            style={{
              fontWeight: 600,
              fontSize: "0.9rem",
              color: "var(--color-text-1)",
              marginBottom: 4,
            }}
          >
            Dr. Kwame Asante
          </div>
          <div
            style={{
              fontSize: "0.78rem",
              color: "var(--color-text-2)",
              marginBottom: 10,
            }}
          >
            AI Research Lead · Google Brain
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 4,
              justifyContent: "center",
              marginBottom: 14,
            }}
          >
            {["Python", "ML", "Research"].map((s) => (
              <SkillPill key={s} label={s} />
            ))}
          </div>
          <button
            style={{
              background: "rgba(0,212,170,0.15)",
              color: "#00D4AA",
              border: "1.5px solid #00D4AA",
              borderRadius: "var(--radius-sm)",
              padding: "8px 20px",
              fontWeight: 600,
              fontSize: "0.8rem",
              cursor: "pointer",
              transition: "all 0.2s",
              width: "100%",
            }}
            onClick={() =>
              showToast("Mentorship request sent to Dr. Kwame Asante!")
            }
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#00D4AA";
              e.currentTarget.style.color = "var(--color-base)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(0,212,170,0.15)";
              e.currentTarget.style.color = "#00D4AA";
            }}
          >
            Request Mentorship
          </button>
        </div>
      </SectionCard>

      <SuggestedCard onViewProfile={onViewProfile} />
    </aside>
  );
}

function SuggestedCard({ onViewProfile }) {
  return (
    <SectionCard>
      <SectionTitle>AI Suggested</SectionTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {SUGGESTED_CONNECTIONS.map((p) => (
          <div
            key={p.name}
            style={{ display: "flex", alignItems: "center", gap: 10 }}
          >
            <div
              onClick={() => onViewProfile && onViewProfile(p.id)}
              style={{ cursor: "pointer", flexShrink: 0 }}
            >
              <Avatar initials={p.initials} color={p.color} size="xs" />
            </div>
            <div
              onClick={() => onViewProfile && onViewProfile(p.id)}
              style={{ flex: 1, minWidth: 0, cursor: "pointer" }}
            >
              <div
                style={{
                  fontWeight: 500,
                  fontSize: "0.82rem",
                  color: "var(--color-text-1)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {p.name}
              </div>
              <div
                style={{
                  fontSize: "0.72rem",
                  color: "var(--color-text-3)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {p.meta}
              </div>
            </div>
            <ConnectBtn name={p.name} />
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

// ── Feed ───────────────────────────────────────────────────────────────────────

function Feed({
  activeTab,
  onTabChange,
  onNavigate,
  onViewProfile,
  currentUser,
  filter,
  setFilter,
  tagSearch,
  onClearTag,
}) {
  const [posts, setPosts] = useState(FEED_POSTS);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  // Tag search words extracted from camelCase tag (e.g. #AfricanAI → ["african","ai"])
  function matchesTagSearch(post) {
    if (!tagSearch) return true;
    const words =
      tagSearch
        .toLowerCase()
        .replace("#", "")
        .match(/[a-z]+/g) || [];
    return words.some(
      (word) =>
        post.tags.some((t) => t.toLowerCase().includes(word)) ||
        post.body.toLowerCase().includes(word),
    );
  }

  const filtered = posts.filter((post) => {
    if (tagSearch) return matchesTagSearch(post);
    if (filter === "All") return true;
    if (filter === "Projects") return !!post.project;
    if (filter === "Opportunities") return !!post.opportunity;
    if (filter === "Research") return !post.project && !post.opportunity;
    return true;
  });

  function handleNewPost(post) {
    setPosts((prev) => [post, ...prev]);
  }

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        minWidth: 200,
      }}
    >
      {/* Composer */}
      <div
        style={{
          background: "var(--color-card)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
          padding: 16,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <button
          onClick={() => onTabChange("profile")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: activeTab === "profile" ? "#f3f4f6" : "transparent",
            border: "none",
            cursor: "pointer",
            padding: "10px 12px",
            borderRadius: 10,
            width: "15%",
            transition: "background 0.15s",
            textAlign: "left",
          }}
          onMouseEnter={(e) => {
            if (activeTab !== "profile")
              e.currentTarget.style.background = "#f9fafb";
          }}
          onMouseLeave={(e) => {
            if (activeTab !== "profile")
              e.currentTarget.style.background = "transparent";
          }}
        >
          <Avatar
            initials={currentUser?.initials || "NA"}
            size="sm"
            color="primary"
          />
        </button>
        <button
          onClick={() => setShowModal(true)}
          style={{
            flex: 1,
            background: "var(--color-surface)",
            border: "1.5px solid var(--color-border)",
            borderRadius: 24,
            padding: "10px 18px",
            color: "var(--color-text-3)",
            fontSize: "0.875rem",
            cursor: "pointer",
            textAlign: "left",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#6C63FF";
            e.currentTarget.style.color = "var(--color-text-2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--color-border)";
            e.currentTarget.style.color = "var(--color-text-3)";
          }}
        >
          Share a project, insight, or update…
        </button>
        <Image
          size={20}
          style={{
            color: "var(--color-text-3)",
            cursor: "pointer",
            flexShrink: 0,
          }}
          onClick={() => setShowModal(true)}
        />
      </div>

      {/* Active tag filter chip */}
      {tagSearch && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 14px",
            background: "rgba(108,99,255,0.07)",
            border: "1px solid rgba(108,99,255,0.2)",
            borderRadius: "var(--radius-sm)",
          }}
        >
          <span
            style={{
              fontSize: "0.82rem",
              color: "#6C63FF",
              fontWeight: 500,
              flex: 1,
            }}
          >
            Showing posts for {tagSearch}
          </span>
          <button
            onClick={onClearTag}
            style={{
              background: "none",
              border: "none",
              color: "#6C63FF",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: "0.78rem",
              padding: 0,
            }}
          >
            <X size={13} /> Clear
          </button>
        </div>
      )}

      {/* Filter bar — hidden when tag search is active */}
      {!tagSearch && (
        <FilterBar
          filters={["All", "Projects", "Research", "Opportunities"]}
          active={filter}
          onChange={setFilter}
        />
      )}

      {loading ? (
        [1, 2, 3].map((n) => <SkeletonPost key={n} />)
      ) : filtered.length === 0 ? (
        <EmptyFeed
          filter={filter}
          tagSearch={tagSearch}
          onClear={tagSearch ? onClearTag : () => setFilter("All")}
        />
      ) : (
        filtered.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onNavigate={onNavigate}
            onViewProfile={onViewProfile}
          />
        ))
      )}

      {showModal && (
        <PostModal
          currentUser={currentUser}
          onClose={() => setShowModal(false)}
          onPost={handleNewPost}
        />
      )}
    </main>
  );
}

// ── Empty State ────────────────────────────────────────────────────────────────

function EmptyFeed({ filter, tagSearch, onClear }) {
  const label = tagSearch
    ? `"${tagSearch}"`
    : filter === "All"
      ? "feed"
      : filter.toLowerCase();
  return (
    <div
      style={{
        textAlign: "center",
        padding: "48px 20px",
        background: "var(--color-card)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
      }}
    >
      <div style={{ fontSize: "2rem", marginBottom: 12 }}>📭</div>
      <div
        style={{
          fontWeight: 600,
          fontSize: "1rem",
          color: "var(--color-text-1)",
          marginBottom: 8,
        }}
      >
        No posts found
      </div>
      <div
        style={{
          fontSize: "0.85rem",
          color: "var(--color-text-3)",
          marginBottom: 16,
        }}
      >
        {tagSearch
          ? `No posts matched the tag ${tagSearch}.`
          : filter === "All"
            ? "Be the first to share something with your network."
            : `Nothing tagged as ${filter} has been posted yet.`}
      </div>
      {(filter !== "All" || tagSearch) && (
        <button
          onClick={onClear}
          style={{
            background: "rgba(108,99,255,0.1)",
            color: "#6C63FF",
            border: "1.5px solid #6C63FF",
            borderRadius: "var(--radius-sm)",
            padding: "7px 20px",
            fontSize: "0.82rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          View all posts
        </button>
      )}
    </div>
  );
}

// ── Post Card ──────────────────────────────────────────────────────────────────

function PostCard({ post, onNavigate, onViewProfile }) {
  const [liked, setLiked] = useState(false);
  const [clapsCount, setClapsCount] = useState(post.claps);

  function handleLike() {
    const next = !liked;
    setLiked(next);
    setClapsCount((c) => (next ? c + 1 : c - 1));
    if (next) showToast("👏 Clapped!");
  }

  function handleShare() {
    showToast("🔗 Link copied to clipboard!");
  }

  function handleComment() {
    showToast("💬 Comment threads coming in Phase 3!");
  }

  return (
    <article
      style={{
        background: "var(--color-card)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        padding: 20,
        transition: "border-color 0.2s",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.borderColor = "var(--color-border-light)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.borderColor = "var(--color-border)")
      }
    >
      {/* Author row */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
          marginBottom: 12,
        }}
      >
        <div
          onClick={() => onViewProfile && onViewProfile(post.profileId)}
          style={{ cursor: "pointer", flexShrink: 0 }}
        >
          <Avatar initials={post.initials} color={post.color} size="md" />
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontWeight: 600,
              fontSize: "0.9rem",
              color: "var(--color-text-1)",
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <span
              onClick={() => onViewProfile && onViewProfile(post.profileId)}
              style={{ cursor: "pointer" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.textDecoration = "underline")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.textDecoration = "none")
              }
            >
              {post.author}
            </span>
            <PostBadge type={post.badgeType} label={post.badge} />
          </div>
          <div
            style={{
              fontSize: "0.75rem",
              color: "var(--color-text-3)",
              marginTop: 2,
            }}
          >
            {post.meta}
          </div>
        </div>
        <button
          style={{
            background: "none",
            border: "none",
            color: "var(--color-text-3)",
            cursor: "pointer",
            padding: 4,
            display: "flex",
          }}
          onClick={() => showToast("Options coming soon")}
        >
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Body */}
      <div
        style={{
          color: "var(--color-text-1)",
          fontSize: "0.875rem",
          lineHeight: 1.6,
          marginBottom: post.mentions?.length > 0 ? 6 : 12,
        }}
        dangerouslySetInnerHTML={{ __html: post.body }}
      />

      {/* @Mentions */}
      {post.mentions?.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
          {post.mentions.map((m) => (
            <span
              key={m}
              style={{
                color: "#00D4AA",
                fontSize: "0.8rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
              onClick={() => showToast(`Profile view for ${m} coming soon!`)}
            >
              {m}
            </span>
          ))}
        </div>
      )}

      {/* Images */}
      {post.images?.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: post.images.length === 1 ? "1fr" : "repeat(2, 1fr)",
            gap: 4,
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
            marginBottom: 12,
          }}
        >
          {post.images.map((url, i) => (
            <img
              key={i}
              src={url}
              alt="Post image"
              style={{
                width: "100%",
                height: post.images.length === 1 ? 280 : 160,
                objectFit: "cover",
                display: "block",
              }}
            />
          ))}
        </div>
      )}

      {/* Project card */}
      {post.project && (
        <div
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              width: 3,
              height: 40,
              borderRadius: 2,
              background: "linear-gradient(135deg, #6C63FF, #00D4AA)",
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontWeight: 600,
                fontSize: "0.85rem",
                color: "var(--color-text-1)",
                marginBottom: 4,
              }}
            >
              {post.project.title}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--color-text-3)" }}>
              {post.project.meta}
            </div>
          </div>
          <button
            onClick={() => showToast("Full project view coming in Phase 3!")}
            style={{
              background: "rgba(108,99,255,0.1)",
              color: "#6C63FF",
              border: "1px solid #6C63FF",
              borderRadius: "var(--radius-sm)",
              padding: "6px 14px",
              fontSize: "0.78rem",
              fontWeight: 500,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            View Project
          </button>
        </div>
      )}

      {/* Opportunity card */}
      {post.opportunity && (
        <div
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 12,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: "0.78rem",
                color: "var(--color-text-2)",
              }}
            >
              <MapPin size={12} /> {post.opportunity.location}
            </span>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: "0.78rem",
                color: "var(--color-text-2)",
              }}
            >
              <Clock size={12} /> {post.opportunity.duration}
            </span>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: "0.78rem",
                color: "var(--color-text-2)",
              }}
            >
              <DollarSign size={12} /> {post.opportunity.pay}
            </span>
          </div>
          <button
            onClick={() => onNavigate("opportunities")}
            style={{
              background: "linear-gradient(135deg, #7B73FF, #00D4AA)",
              color: "white",
              border: "none",
              borderRadius: "var(--radius-sm)",
              padding: "7px 18px",
              fontWeight: 600,
              fontSize: "0.82rem",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            View Opportunity
          </button>
        </div>
      )}

      {/* Tags — clicking filters feed */}
      {post.tags.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            marginBottom: 14,
          }}
        >
          {post.tags.map((t) => (
            <span
              key={t}
              onClick={() => showToast(`Filtering by ${t}`)}
              style={{
                color: "#6C63FF",
                fontSize: "0.78rem",
                cursor: "pointer",
              }}
            >
              {t}
            </span>
          ))}
        </div>
      )}

      {/* Engagement row */}
      <div
        style={{
          display: "flex",
          gap: 4,
          paddingTop: 12,
          borderTop: "1px solid var(--color-border)",
        }}
      >
        <EngageBtn
          onClick={handleLike}
          active={liked}
          activeColor="#6C63FF"
          icon={<Heart size={16} fill={liked ? "#6C63FF" : "none"} />}
          label={`${clapsCount}`}
        />
        <EngageBtn
          onClick={handleComment}
          icon={<MessageCircle size={16} />}
          label={`${post.comments} comments`}
        />
        <EngageBtn
          onClick={handleShare}
          icon={<Share2 size={16} />}
          label="Share"
        />
      </div>
    </article>
  );
}

function EngageBtn({ onClick, icon, label, active, activeColor }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "none",
        border: "none",
        color: active ? activeColor : "var(--color-text-3)",
        padding: "6px 12px",
        borderRadius: "var(--radius-sm)",
        cursor: "pointer",
        fontSize: "0.8rem",
        display: "flex",
        alignItems: "center",
        gap: 6,
        transition: "all 0.15s",
        fontWeight: active ? 600 : 400,
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.background = "var(--color-surface)";
          e.currentTarget.style.color = "var(--color-text-1)";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.background = "none";
          e.currentTarget.style.color = "var(--color-text-3)";
        }
      }}
    >
      {icon}
      {label}
    </button>
  );
}

// ── Post Creation Modal ────────────────────────────────────────────────────────

function PostModal({ currentUser, onClose, onPost }) {
  const [body, setBody] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [mentionInput, setMentionInput] = useState("");
  const [mentions, setMentions] = useState([]);
  const [images, setImages] = useState([]);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  function handleTagKey(e) {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const raw = tagInput.trim();
      const tag = raw.startsWith("#") ? raw : `#${raw}`;
      if (!tags.includes(tag)) setTags((prev) => [...prev, tag]);
      setTagInput("");
    }
  }

  function removeTag(tag) {
    setTags((prev) => prev.filter((t) => t !== tag));
  }

  function handleMentionKey(e) {
    if (e.key === "Enter" && mentionInput.trim()) {
      e.preventDefault();
      const raw = mentionInput.trim();
      const mention = raw.startsWith("@") ? raw : `@${raw}`;
      if (!mentions.includes(mention)) setMentions((prev) => [...prev, mention]);
      setMentionInput("");
    }
  }

  function removeMention(m) {
    setMentions((prev) => prev.filter((x) => x !== m));
  }

  function handleImageUpload(e) {
    const files = Array.from(e.target.files || []);
    const next = files
      .slice(0, 4 - images.length)
      .map((f) => ({ url: URL.createObjectURL(f), name: f.name }));
    setImages((prev) => [...prev, ...next].slice(0, 4));
    e.target.value = "";
  }

  function removeImage(idx) {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  }

  function wrapSelection(open, close) {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    if (start === end) return;
    const selected = body.substring(start, end);
    setBody(body.substring(0, start) + open + selected + close + body.substring(end));
  }

  function handleSubmit() {
    if (!body.trim()) return;
    const role = currentUser?.role;
    onPost({
      id: Date.now(),
      profileId: null,
      initials: currentUser?.initials || "U",
      author: currentUser?.name || "You",
      badge:
        role === "alumni"
          ? "Mentor"
          : role === "company"
            ? "Company"
            : "Student",
      badgeType:
        role === "alumni"
          ? "mentor"
          : role === "company"
            ? "company"
            : "student",
      meta: "Just now",
      color: "primary",
      body: body.replace(/\n/g, "<br>"),
      tags,
      mentions,
      images: images.map((i) => i.url),
      claps: 0,
      comments: 0,
    });
    showToast("Post shared with your network!");
    onClose();
  }

  const chipStyle = (color) => ({
    display: "flex",
    alignItems: "center",
    gap: 4,
    background: color === "purple" ? "rgba(108,99,255,0.1)" : "rgba(0,212,170,0.1)",
    color: color === "purple" ? "#6C63FF" : "#00D4AA",
    borderRadius: 20,
    padding: "3px 10px",
    fontSize: "0.78rem",
  });

  const chipBtnStyle = {
    background: "none",
    border: "none",
    color: "inherit",
    cursor: "pointer",
    fontSize: "0.95rem",
    padding: 0,
    lineHeight: 1,
  };

  const inputStyle = {
    width: "100%",
    background: "var(--color-surface)",
    border: "1.5px solid var(--color-border)",
    borderRadius: "var(--radius-sm)",
    padding: "8px 12px",
    color: "var(--color-text-1)",
    fontSize: "0.85rem",
    fontFamily: "var(--font-body)",
    outline: "none",
    boxSizing: "border-box",
  };

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
          maxWidth: 560,
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 18,
          }}
        >
          <Avatar
            initials={currentUser?.initials || "U"}
            size="md"
            color="primary"
          />
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontWeight: 600,
                fontSize: "0.9rem",
                color: "var(--color-text-1)",
              }}
            >
              {currentUser?.name || "You"}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--color-text-3)" }}>
              Share with your network
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--color-text-3)",
              padding: 4,
              display: "flex",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Share a project, insight, or update…"
          autoFocus
          style={{
            width: "100%",
            minHeight: 130,
            background: "var(--color-surface)",
            border: "1.5px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            padding: "12px 14px",
            color: "var(--color-text-1)",
            fontSize: "0.9rem",
            lineHeight: 1.6,
            resize: "vertical",
            fontFamily: "var(--font-body)",
            outline: "none",
            boxSizing: "border-box",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#6C63FF")}
          onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
        />

        {/* Formatting toolbar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            padding: "6px 0",
            marginBottom: 10,
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <span style={{ fontSize: "0.72rem", color: "var(--color-text-3)", marginRight: 4 }}>
            Format:
          </span>
          <button
            title="Bold selected text"
            onClick={() => wrapSelection("<strong>", "</strong>")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              background: "none",
              border: "1px solid var(--color-border)",
              borderRadius: 6,
              padding: "4px 8px",
              cursor: "pointer",
              color: "var(--color-text-2)",
              fontSize: "0.75rem",
              fontWeight: 600,
            }}
          >
            <Bold size={13} /> Bold
          </button>
          <button
            title="Highlight selected text"
            onClick={() => wrapSelection("<mark>", "</mark>")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              background: "none",
              border: "1px solid var(--color-border)",
              borderRadius: 6,
              padding: "4px 8px",
              cursor: "pointer",
              color: "var(--color-text-2)",
              fontSize: "0.75rem",
            }}
          >
            <Highlighter size={13} /> Highlight
          </button>
          <div style={{ flex: 1 }} />
          <button
            title="Add photos (max 4)"
            onClick={() => fileInputRef.current?.click()}
            disabled={images.length >= 4}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              background: images.length >= 4 ? "var(--color-surface)" : "rgba(108,99,255,0.08)",
              border: "1px solid var(--color-border)",
              borderRadius: 6,
              padding: "4px 10px",
              cursor: images.length >= 4 ? "not-allowed" : "pointer",
              color: images.length >= 4 ? "var(--color-text-3)" : "#6C63FF",
              fontSize: "0.75rem",
              fontWeight: 500,
            }}
          >
            <Image size={13} />
            {images.length > 0 ? `${images.length}/4` : "Photo"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />
        </div>

        {/* Image previews */}
        {images.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: images.length === 1 ? "1fr" : "repeat(2, 1fr)",
              gap: 6,
              marginBottom: 12,
            }}
          >
            {images.map((img, idx) => (
              <div
                key={idx}
                style={{ position: "relative", borderRadius: "var(--radius-sm)", overflow: "hidden" }}
              >
                <img
                  src={img.url}
                  alt={img.name}
                  style={{
                    width: "100%",
                    height: images.length === 1 ? 200 : 120,
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                <button
                  onClick={() => removeImage(idx)}
                  style={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    background: "rgba(0,0,0,0.55)",
                    border: "none",
                    borderRadius: "50%",
                    width: 24,
                    height: 24,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "white",
                  }}
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Hashtags */}
        {tags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
            {tags.map((tag) => (
              <span key={tag} style={chipStyle("purple")}>
                {tag}
                <button onClick={() => removeTag(tag)} style={chipBtnStyle}>×</button>
              </span>
            ))}
          </div>
        )}
        <input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagKey}
          placeholder="# Add a hashtag and press Enter (e.g. fintech)"
          style={{ ...inputStyle, marginBottom: 10 }}
          onFocus={(e) => (e.target.style.borderColor = "#6C63FF")}
          onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
        />

        {/* Mentions */}
        {mentions.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
            {mentions.map((m) => (
              <span key={m} style={chipStyle("teal")}>
                {m}
                <button onClick={() => removeMention(m)} style={chipBtnStyle}>×</button>
              </span>
            ))}
          </div>
        )}
        <input
          value={mentionInput}
          onChange={(e) => setMentionInput(e.target.value)}
          onKeyDown={handleMentionKey}
          placeholder="@ Tag someone and press Enter (e.g. Emmanuel)"
          style={{ ...inputStyle, marginBottom: 18 }}
          onFocus={(e) => (e.target.style.borderColor = "#00D4AA")}
          onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
        />

        {/* Actions */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "1.5px solid var(--color-border)",
              color: "var(--color-text-2)",
              borderRadius: "var(--radius-sm)",
              padding: "8px 20px",
              cursor: "pointer",
              fontWeight: 500,
              fontSize: "0.85rem",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!body.trim()}
            style={{
              background: body.trim()
                ? "linear-gradient(135deg, #7B73FF, #00D4AA)"
                : "var(--color-border)",
              color: body.trim() ? "white" : "var(--color-text-3)",
              border: "none",
              borderRadius: "var(--radius-sm)",
              padding: "8px 26px",
              cursor: body.trim() ? "pointer" : "not-allowed",
              fontWeight: 600,
              fontSize: "0.85rem",
              transition: "opacity 0.2s",
            }}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Connect Button ─────────────────────────────────────────────────────────────

function ConnectBtn({ name }) {
  const [connected, setConnected] = useState(false);
  return (
    <button
      onClick={() => {
        const next = !connected;
        setConnected(next);
        showToast(next ? `Connected with ${name}!` : "Connection removed");
      }}
      style={{
        background: connected ? "#6C63FF" : "rgba(108,99,255,0.12)",
        color: connected ? "white" : "#6C63FF",
        border: "1.5px solid #6C63FF",
        borderRadius: 20,
        padding: "4px 12px",
        fontSize: "0.75rem",
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.2s",
        whiteSpace: "nowrap",
      }}
    >
      {connected ? "Connected ✓" : "Connect"}
    </button>
  );
}

// ── Main Export ────────────────────────────────────────────────────────────────

export default function HomeTab({ onNavigate, onViewProfile, currentUser }) {
  const [filter, setFilter] = useState("All");
  const [tagSearch, setTagSearch] = useState(null);
  const [activeTab, setActiveTab] = useState("feeds");
  const isMobile = useIsMobile(900);

  function handleTagFilter(tag) {
    setTagSearch(tag);
    setFilter("All");
    if (isMobile) setActiveTab("feeds");
  }

  function clearTag() {
    setTagSearch(null);
  }

  if (isMobile) {
    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
        {/* Tab bar */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid var(--color-border)",
            background: "var(--color-base)",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          {["feeds", "suggested"].map((tab) => {
            const active = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  background: "none",
                  border: "none",
                  borderBottom: active
                    ? "2.5px solid #6C63FF"
                    : "2.5px solid transparent",
                  color: active ? "#6C63FF" : "var(--color-text-3)",
                  fontWeight: active ? 700 : 500,
                  fontSize: "0.9rem",
                  padding: "13px 0",
                  cursor: "pointer",
                  textTransform: "capitalize",
                  letterSpacing: "0.01em",
                  transition: "color 0.15s, border-color 0.15s",
                }}
              >
                {tab === "feeds" ? "Feeds" : "Suggested"}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div style={{ padding: "16px 16px 24px" }}>
          {activeTab === "feeds" ? (
            <Feed
              onNavigate={onNavigate}
              onViewProfile={onViewProfile}
              currentUser={currentUser}
              filter={filter}
              setFilter={setFilter}
              tagSearch={tagSearch}
              onClearTag={clearTag}
            />
          ) : (
            <RightSidebar
              onViewProfile={onViewProfile}
              onTagFilter={handleTagFilter}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "28px 20px",
        display: "grid",
        gridTemplateColumns: "1fr 280px",
        gap: 24,
      }}
    >
      <Feed
        onNavigate={onNavigate}
        onViewProfile={onViewProfile}
        currentUser={currentUser}
        filter={filter}
        setFilter={setFilter}
        tagSearch={tagSearch}
        onClearTag={clearTag}
      />
      <RightSidebar
        onViewProfile={onViewProfile}
        onTagFilter={handleTagFilter}
      />
    </div>
  );
}
