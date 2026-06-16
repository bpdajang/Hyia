import { useState } from "react";
import {
  Avatar,
  SkillTag,
  SkillPill,
  FilterBar,
  SectionCard,
  SectionTitle,
  AiTag,
  PostBadge,
} from "../ui/index.jsx";
import {
  FEED_POSTS,
  SUGGESTED_CONNECTIONS,
  TRENDING,
  CURRENT_USER,
} from "../../data/index.js";
import {
  Heart,
  MessageCircle,
  Share,
  Camera,
  SquareMenu,
  Video,
  MoreHorizontal,
  MapPin,
  Clock,
  DollarSign,
} from "lucide-react";

// ---- Left Sidebar ----
// function LeftSidebar() {
//   return (
//     <aside style={{ display: "flex", flexDirection: "column", gap: 16 }}>
//       {/* <ProfileCard /> */}
//       <SuggestedCard />
//     </aside>
//   );
// }

// function ProfileCard() {
//   return (
//     <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
//       <div style={{ height: 72, background: 'linear-gradient(135deg, rgba(108,99,255,0.25), rgba(0,212,170,0.25))' }} />
//       <div style={{ padding: '0 20px 20px' }}>
//         <div style={{ marginTop: -28, marginBottom: 12, border: '3px solid var(--color-card)', borderRadius: '50%', display: 'inline-block' }}>
//           <Avatar initials="NA" color="primary" size="lg" />
//         </div>
//         <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--color-text-1)', marginBottom: 2 }}>
//           {CURRENT_USER.name}
//         </h3>
//         <p style={{ color: '#00D4AA', fontSize: '0.8rem', fontWeight: 500, marginBottom: 8 }}>{CURRENT_USER.title}</p>
//         <p style={{ color: 'var(--color-text-2)', fontSize: '0.8rem', lineHeight: 1.4, marginBottom: 14 }}>{CURRENT_USER.bio}</p>
//         <div style={{ display: 'flex', gap: 20, padding: '12px 0', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', marginBottom: 14 }}>
//           <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
//             <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-text-1)' }}>{CURRENT_USER.connections}</span>
//             <span style={{ fontSize: '0.7rem', color: 'var(--color-text-3)' }}>Connections</span>
//           </div>
//           <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
//             <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-text-1)' }}>{CURRENT_USER.endorsements}</span>
//             <span style={{ fontSize: '0.7rem', color: 'var(--color-text-3)' }}>Endorsements</span>
//           </div>
//         </div>
//         <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
//           {[{ icon: 'li', label: 'LinkedIn' }, { icon: 'gh', label: 'GitHub' }].map(l => (
//             <a key={l.label} href="#"
//               style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-2)', borderRadius: 20, padding: '5px 12px', fontSize: '0.75rem', textDecoration: 'none', transition: 'all 0.2s' }}
//               onMouseEnter={e => { e.currentTarget.style.borderColor = '#6C63FF'; e.currentTarget.style.color = '#6C63FF'; }}
//               onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-2)'; }}
//             >
//               {l.label}
//             </a>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// ---- Right Sidebar ----
function RightSidebar({ onViewProfile }) {
  return (
    <aside style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SectionCard>
        <SectionTitle>Trending on Hyia</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {TRENDING.map((t) => (
            <div
              key={t.num}
              style={{ display: "flex", alignItems: "center", gap: 10 }}
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
            <ConnectBtn />
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

// ---- Feed ----
function Feed({ onNavigate, onViewProfile }) {
  const [filter, setFilter] = useState("All");

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
        <Avatar initials="NA" size="sm" color="primary" />
        <button
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

        <Camera
          style={{
            color: "var(--color-text-3)",
            hover: { color: "var(--color-primary)" },
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#6C63FF";
            e.currentTarget.style.color = "var(--color-text-2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--color-border)";
            e.currentTarget.style.color = "var(--color-text-3)";
          }}
        />
        <Video
          style={{
            color: "var(--color-text-3)",
            hover: { color: "var(--color-primary)" },
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#6C63FF";
            e.currentTarget.style.color = "var(--color-text-2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--color-border)";
            e.currentTarget.style.color = "var(--color-text-3)";
          }}
        />

        <SquareMenu
          style={{
            color: "var(--color-text-3)",
            hover: { color: "var(--color-primary)" },
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#6C63FF";
            e.currentTarget.style.color = "var(--color-text-2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--color-border)";
            e.currentTarget.style.color = "var(--color-text-3)";
          }}
        />
      </div>

      <FilterBar
        filters={["All", "Projects", "Research", "Opportunities"]}
        active={filter}
        onChange={setFilter}
      />

      {FEED_POSTS.map((post) => (
        <PostCard key={post.id} post={post} onNavigate={onNavigate} onViewProfile={onViewProfile} />
      ))}
    </main>
  );
}

function PostCard({ post, onNavigate, onViewProfile }) {
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
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
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
            alignItems: "center",
          }}
        >
          <MoreHorizontal size={18} />
        </button>
      </div>

      <div
        style={{
          color: "var(--color-text-1)",
          fontSize: "0.875rem",
          lineHeight: 1.6,
          marginBottom: 12,
        }}
        dangerouslySetInnerHTML={{ __html: post.body }}
      />

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
            style={{
              background: "rgba(108,99,255,0.15)",
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
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.78rem", color: "var(--color-text-2)" }}>
              <MapPin size={12} /> {post.opportunity.location}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.78rem", color: "var(--color-text-2)" }}>
              <Clock size={12} /> {post.opportunity.duration}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.78rem", color: "var(--color-text-2)" }}>
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
            Apply Now
          </button>
        </div>
      )}

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

      <div
        style={{
          display: "flex",
          gap: 4,
          paddingTop: 12,
          borderTop: "1px solid var(--color-border)",
        }}
      >
        {[
          {
            key: "claps",
            content: (
              <>
                <Heart size={16} /> {post.claps}
              </>
            ),
          },
          {
            key: "comments",
            content: (
              <>
                <MessageCircle size={16} /> {post.comments} comments
              </>
            ),
          },
          {
            key: "share",
            content: (
              <>
                <Share size={16} /> Share
              </>
            ),
          },
        ].map(({ key, content }) => (
          <button
            key={key}
            style={{
              background: "none",
              border: "none",
              color: "var(--color-text-3)",
              padding: "6px 12px",
              borderRadius: "var(--radius-sm)",
              cursor: "pointer",
              fontSize: "0.8rem",
              display: "flex",
              alignItems: "center",
              gap: 6,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--color-surface)";
              e.currentTarget.style.color = "var(--color-text-1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "none";
              e.currentTarget.style.color = "var(--color-text-3)";
            }}
          >
            {content}
          </button>
        ))}
      </div>
    </article>
  );
}

// ---- Main Export ----
export default function HomeTab({ onNavigate, onViewProfile }) {
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
      {/* <LeftSidebar /> */}
      <Feed onNavigate={onNavigate} onViewProfile={onViewProfile} />
      <RightSidebar onViewProfile={onViewProfile} />
    </div>
  );
}

function ConnectBtn() {
  const [connected, setConnected] = useState(false);
  return (
    <button
      onClick={() => setConnected((c) => !c)}
      style={{
        background: connected ? "#6C63FF" : "rgba(108,99,255,0.15)",
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
