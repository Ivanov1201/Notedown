import ToastProvider from "@/contexts/ToastProvider";
import "@/styles/globals.css";
import "@/styles/xterm.css";
import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Metadata } from "next";
import { Petrona, Nunito_Sans, IBM_Plex_Mono } from "next/font/google";
import { cookies, headers } from "next/headers";
import SupabaseProvider from "./appContext";
import ExpandedImageProvider from "@components/BlogPostComponents/ExpandedImage/ExpandedImageProvider";
import ExpandedCanvasProvider from "@components/BlogPostComponents/ExpandedCanvas/ExpandedCanvasProvider";
import IndexedDbContextProvider from "@components/Contexts/IndexedDbContext";

const serif = Petrona({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-serif",
	style: ["normal", "italic"],
	weight: ["400", "700"],
});
const mono = IBM_Plex_Mono({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-mono",
	weight: ["400", "700", "500"],
});
const sans = Nunito_Sans({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-sans",
	style: ["normal", "italic"],
	weight: ["400", "700", "300"],
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
						<ExpandedImageProvider>
							<ExpandedCanvasProvider>
								<IndexedDbContextProvider>
									{children}
								</IndexedDbContextProvider>
							</ExpandedCanvasProvider>
						</ExpandedImageProvider>
					</ToastProvider>
				</SupabaseProvider>
			</body>
		</html>
	);
}
