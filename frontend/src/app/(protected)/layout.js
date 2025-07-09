import ProtectedAppShell from "@/modules/shared/ProtectedAppShell";

// app/(protected)/layout.jsx
export default function ProtectedLayout({ children }) {
  return (
    <>
      {/* ✅ You can add Sidebar/Header here */}
     <ProtectedAppShell>
      {
        children
      }
     </ProtectedAppShell>
    </>
  );
}