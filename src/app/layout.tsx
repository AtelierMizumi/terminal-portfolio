import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AchievementProvider } from "@/contexts/AchievementContext";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Terminal Portfolio",
  description: "A terminal-style portfolio website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-[#1E202C] text-foreground`}
      >
        <ThemeProvider>
          <AchievementProvider>
            {children}
            <Toaster />
          </AchievementProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
