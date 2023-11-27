"use client";
import useRetrieveDraftFromIndexDb from "@/hooks/useRetrieveBlogFromIndexDb";
import Blog from "@components/BlogPostComponents/Blog";
import { BlogContext } from "@components/BlogPostComponents/BlogState";
import Footers from "@components/BlogPostComponents/Footers";
import PostPreviewControls from "@components/PostPreviewComponents/PostPreviewControls";
import { tagToJsx } from "@utils/html2Jsx/defaultJsxConverter";
import { mdToHast, transformer } from "@utils/html2Jsx/transformer";
import { parseFrontMatter } from "@utils/parseFrontMatter";
import { useSearchParams } from "next/navigation";
import { useContext, useEffect } from "react";

function DraftPreview({ params }: { params: { draftId: string } }) {
	const blogData = useRetrieveDraftFromIndexDb({ timeStamp: params.draftId });
	const { dispatch } = useContext(BlogContext);
	const searchParams = useSearchParams();
	useEffect(() => {
		if (blogData) {
			dispatch({ type: "set blog meta", payload: blogData.data });
		}
	}, [blogData]);
	return (
		<div
			className="flex flex-col items-center justify-center w-full relative
			 
		"
		>
			{/* <PublishModal publishPostAction={publishPostAction} /> */}
			<Blog
				language={blogData.data?.language}
				markdown={blogData.content}
				AuthorComponent={() => <></>}
			>
				{transformer(
					mdToHast(parseFrontMatter(blogData.content).content)
						.htmlAST,
					tagToJsx
				)}
				{tagToJsx.footnotes!.length > 0 && (
					<Footers
						footNotes={tagToJsx.footnotes!}
						tagToJsxConverter={tagToJsx}
					/>
				)}
			</Blog>
			<PostPreviewControls
				markdown={blogData.content}
				postMeta={{
					timestamp: params.draftId,
					id:
						blogData.data.postId ||
						parseInt(searchParams?.get("postId") || "0") ||
						undefined,
				}}
			/>
		</div>
	);
}

export default DraftPreview;
