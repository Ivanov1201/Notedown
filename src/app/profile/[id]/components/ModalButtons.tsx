"use client";
import useShortCut from "@/hooks/useShortcut";
import { cn } from "@/lib/utils";
import { BsArrowsAngleExpand } from "react-icons/bs";
import { ToolTipComponent } from "../../../../components/ToolTipComponent";

export function ExpandButton({
	postId,
	published,
	className,
}: {
	postId: number;
	published: boolean;
	className?: string;
}) {
	const port = process.env.NODE_ENV === "development" ? ":3000" : "";
	const url =
		window.location.protocol +
		"//" +
		window.location.hostname +
		port +
		(published ? `/post/${postId}` : `/post/private/${postId}`);

	useShortCut({
		keys: ["e"],
		callback: () => {
			window.location.href = url;
		},
	});

	return (
		<ToolTipComponent
			tip="Expand (E)"
			className={cn("text-gray-400", className)}
		>
			<a href={url}>
				<BsArrowsAngleExpand size={20} />
			</a>
		</ToolTipComponent>
	);
}
