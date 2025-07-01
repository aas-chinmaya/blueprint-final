'use client'

export function AppShell({ children }) {
  return (
    <main
      className="m-2 flex flex-1 flex-col gap-4 px-4 py-4 md:px-6 md:py-6 bg-muted/50 rounded-xl overflow-y-auto h-full"
    >
      {children}
    </main>
  )
}
