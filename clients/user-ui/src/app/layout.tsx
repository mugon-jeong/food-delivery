import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import Providers from "@/src/app/providers/NextUiProvider";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "Becodemy Food Delivery",
    description: "Becodemy Food Delivery website",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <Providers>
            {children}
        </Providers>
        </body>
        </html>
    );
}
