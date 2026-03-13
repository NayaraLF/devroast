import { JetBrains_Mono } from "next/font/google";
import { Navbar, NavbarLink, NavbarLogo } from "@/components/navbar";
import { TRPCReactProvider } from "@/trpc/client";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jetbrainsMono.variable} font-sans`}>
        <TRPCReactProvider>
          <Navbar>
            <NavbarLogo />
            <NavbarLink href="/leaderboard">leaderboard</NavbarLink>
          </Navbar>
          <main>{children}</main>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
