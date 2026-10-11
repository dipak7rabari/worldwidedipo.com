export default function Loading() {
  return (
    <main
      aria-label="Loading"
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "var(--background)"
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14
        }}
      >
        <div
          aria-hidden="true"
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            border: "3px solid var(--border)",
            borderTopColor: "var(--primary)",
            animation: "dipo-spin 0.8s linear infinite"
          }}
        />

        <span
          style={{
            color: "var(--muted)",
            fontSize: 14
          }}
        >
          Loading Worldwide DIPO...
        </span>
      </div>

      <style>{`
        @keyframes dipo-spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </main>
  );
}