import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "H2V Araucanía — Hidrógeno Verde en La Araucanía",
    template: "%s | H2V Araucanía",
  },
  description:
    "Plataforma informativa sobre los avances, proyectos y oportunidades del hidrógeno verde en la región de La Araucanía, Chile.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // This is just a pass-through layout.
  // The actual <html> tags are in (frontend)/layout.tsx and (payload)/layout.tsx
  return children;
}
