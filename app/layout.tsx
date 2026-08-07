import type { Metadata } from "next"
import "./globals.css"
import localFont from "next/font/local"
import { ThemeProvider } from "@/components/ThemeContext"
import BackgroundScene from "@/components/BackgroundScene"
import ClientRoot from "@/components/ClientRoot"

export const metadata: Metadata = {
  title: "Alif's Portfolio",
  description: "Personal portfolio of Alif Syabani",
  icons: {
    icon: "/moon.jpg",
    shortcut: "/moon.jpg",
    apple: "/moon.jpg",
  },
}

const cabinet = localFont({
  src: [
    {
      path: "../public/fonts/CabinetGrotesk-Variable.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-cabinet",
})

const themeInitScript = `
(function() {
  try {
    var theme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {}
})();
`

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`${cabinet.variable} font-cabinet antialiased`}>
        <ThemeProvider>
          <BackgroundScene />
          <ClientRoot>{children}</ClientRoot>
        </ThemeProvider>
      </body>
    </html>
  )
}