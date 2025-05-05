
import '../styles/globals.css'

export const metadata = {
  title: 'Comic Newsletter',
  description: 'A comic-style newsletter built with Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
