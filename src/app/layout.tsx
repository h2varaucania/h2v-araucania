// Metadata is defined in each route group's layout:
// - (frontend)/layout.tsx — public site SEO metadata
// - (payload)/layout.tsx — admin panel metadata

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // This is just a pass-through layout.
  // The actual <html> tags are in (frontend)/layout.tsx and (payload)/layout.tsx
  return children;
}
