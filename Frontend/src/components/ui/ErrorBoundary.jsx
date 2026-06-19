import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ maxWidth: 560, margin: "80px auto", padding: "40px 28px", textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>⚠️</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.2rem", color: "var(--color-text-1)", marginBottom: 10 }}>
            Something went wrong
          </h2>
          <p style={{ fontSize: "0.875rem", color: "var(--color-text-2)", lineHeight: 1.6, marginBottom: 24 }}>
            This section crashed unexpectedly. The rest of the app is still working.
          </p>
          <button
            onClick={() => this.setState({ error: null })}
            style={{ background: "linear-gradient(135deg, #7B73FF, #00D4AA)", color: "white", border: "none", borderRadius: "var(--radius-sm)", padding: "10px 24px", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer" }}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
