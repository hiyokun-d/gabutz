import "./globals.css"

export const metadata = {
  title: 'gabutz',
  description: "Gabutz chat app it's basically just a chat app cause i'm just want to learning how to design a web app that really responsive",
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
