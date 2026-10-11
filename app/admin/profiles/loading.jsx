// app/admin/profiles/loading.jsx

export default function AdminProfilesLoading() {
  return (
    <main
      className="min-h-screen bg-white px-6 py-10"
      aria-busy="true"
      aria-label="Loading admin profiles"
    >
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="h-8 w-56 animate-pulse rounded-lg bg-gray-200" />

        <div className="h-4 w-80 animate-pulse rounded bg-gray-100" />

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-2xl border border-gray-100 bg-gray-50"
            />
          ))}
        </section>

        <section className="h-96 animate-pulse rounded-2xl border border-gray-100 bg-gray-50" />
      </div>
    </main>
  );
}