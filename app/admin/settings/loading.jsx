// app/admin/settings/loading.jsx

export default function AdminSettingsLoading() {
  return (
    <main
      className="min-h-screen bg-white px-6 py-10"
      aria-busy="true"
      aria-label="Loading admin settings"
    >
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="h-8 w-64 animate-pulse rounded-lg bg-gray-200" />

        <div className="h-4 w-96 max-w-full animate-pulse rounded bg-gray-100" />

        <section className="space-y-4 rounded-2xl border border-gray-100 bg-gray-50 p-6">
          <div className="h-5 w-40 animate-pulse rounded bg-gray-200" />
          <div className="h-10 w-full animate-pulse rounded-xl bg-white" />
          <div className="h-10 w-full animate-pulse rounded-xl bg-white" />
          <div className="h-10 w-3/4 animate-pulse rounded-xl bg-white" />
        </section>

        <section className="h-48 animate-pulse rounded-2xl border border-gray-100 bg-gray-50" />
      </div>
    </main>
  );
}