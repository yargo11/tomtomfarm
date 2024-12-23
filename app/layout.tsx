import "@/styles/globals.css";
import type { Metadata, Viewport } from "next";
import clsx from "clsx";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { FarmsProvider } from "@/context/farmContext";
import Link from "next/link";
import { Divider } from "@nextui-org/react";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en" className='light'>
      <head />

      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <div className="flex flex-row justify-center md:h-12 h-16 px-4 w-full items-center shadow-lg flex-wrap md:justify-between">
          <div>
            <h1 className='text-2xl text-gray-900'>Tomtom Farms</h1>
          </div>
          <div className="flex flex-row gap-x-2">
            <Link
              href='/manage-farms'
              className="underline-offset-2 hover:text-cyan-600 transition-all duration-200"
            >
              Go to Farms
            </Link>
            <Divider orientation="vertical" className="h-auto" />
            <Link
              href='/manage-crops'
              className="underline-offset-2 hover:text-cyan-600 transition-all duration-200"
            >
              Go to Crops
            </Link>
          </div>
        </div>
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          <FarmsProvider>
            {children}
          </FarmsProvider>
        </Providers>
      </body>
    </html>
  );
}
