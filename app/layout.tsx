import type { Metadata } from "next"
import "./globals.css"
import localFont from "next/font/local"
import SpaceBackground from "@/components/SpaceBackground"
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


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${cabinet.variable} text-white font-cabinet antialiased`}>
        <SpaceBackground />
        <ClientRoot>{children}</ClientRoot>
      </body>
    </html>
  )
}
