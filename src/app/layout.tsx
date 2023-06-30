import Navbar from "@components/Navbar/Navbar";
import "@/styles/globals.css";
import "@/styles/xterm.css";
import { Metadata } from "next";
import SupabaseProvider from "./appContext";
import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/headers";
import ToastProvider from "@/contexts/ToastProvider";
import ToastDisplay from "@components/ToastDisplay";
import {
	IBM_Plex_Serif,
	Source_Code_Pro,
	IBM_Plex_Sans,
} from "next/font/google";

const serif = IBM_Plex_Serif({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-serif",
	weight: ["400", "700"],
});
const mono = Source_Code_Pro({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-mono",
	weight: ["400", "700"],
});
const sans = IBM_Plex_Sans({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-sans",
	weight: ["400", "700"],
});

export const metadata: Metadata = {
	title: "Rce-blog",
	description:
		"Write posts/notes containing prose, executable code snippets, free hand drawings and images.",
	icons: {
		icon: "/icon.png",
	},
	twitter: {
		title: "Rce-blog",
		description:
			"Write posts/notes containing prose, executable code snippets, free hand drawings and images.",
		card: "summary",
	},
	openGraph: {
		url: "http://rce-blog.xyz",
		type: "website",
		title: "Rce-blog",
		siteName: "Rce-blog",
		description:
			"Write posts/notes containing prose, executable code snippets, free hand drawings and images.",
	},
};

export default async function RootLayout({
	// Layouts must accept a children prop.
	// This will be populated with nested layouts or pages
	children,
}: {
	children: React.ReactNode;
}) {
	const supabase = createServerComponentSupabaseClient({
		headers,
		cookies,
	});

	const {
		data: { session },
	} = await supabase.auth.getSession();

	return (
		<html
			lang="en"
			className={`dark ${serif.variable} ${sans.variable} ${mono.variable}`}
		>
			<body className="flex flex-col h-screen w-full bg-gray-200 dark:bg-black transition-colors duration-300">
				<SupabaseProvider session={session}>
					<ToastProvider>
						<Navbar />

						{children}
						<ToastDisplay />
					</ToastProvider>
				</SupabaseProvider>
			</body>
		</html>
	);
}
