import type { Metadata } from "next";
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Inter } from "next/font/google";

import { AuthProvider } from "@/contexts/AuthContext";
import "@mdxeditor/editor/style.css";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Slack Clone",
  description: "A Slack clone using Next.js, Shadcn UI and Supabase.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NuqsAdapter>
        <AuthProvider>
          <Toaster />
            {children}
          </AuthProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
