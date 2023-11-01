"use client";
import useInSync from "@/hooks/useInSync";
import { AlertCircle, AlertTriangle } from "lucide-react";

import React, { useContext } from "react";
import { BlogContext } from "./BlogState";
import Link from "next/link";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

function SyncWarning({ markdown }: { markdown: string }) {
	const inSync = useInSync({ markdown });
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const params = useParams();
	const { blogState } = useContext(BlogContext);
	const { blogMeta } = blogState;
	if (inSync) {
		return <></>;
	}

	return (
		<div className="flex gap-1 items-center">
			<span>.</span>
			<AlertTriangle size={14} />
			<span>The</span>
			<Link
				href={
					pathname?.startsWith("/draft")
						? `${pathname}?${searchParams?.toString()}`
						: `/draft/${
								blogMeta.timeStamp
						  }?synced=false&postId=${params?.postId!}&public=${!pathname?.includes(
								"private"
						  )}`
				}
				className={cn(
					"underline hover:italic",
					pathname?.startsWith("/draft") ? "text-gray-100" : ""
				)}
			>
				local
			</Link>
			<span>and</span>
			<Link
				href={
					pathname?.startsWith("/post")
						? pathname
						: searchParams?.get("public") === "false"
						? `/post/private/${searchParams.get(
								"postId"
						  )}?synced=false`
						: `/post/${searchParams?.get("postId")}?synced=false`
				}
				className={cn(
					"underline hover:italic",
					pathname?.startsWith("/post") ? "text-gray-100" : ""
				)}
			>
				uploaded
			</Link>
			<span>versions are not synced</span>
		</div>
	);
}

export default SyncWarning;