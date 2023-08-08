import PostWithBlogger from "@/interfaces/PostWithBlogger";
import PostComponent from "./PostComponent";

interface PostDisplayProps {
	posts: PostWithBlogger[];
}

function PostDisplay({ posts }: PostDisplayProps) {
	return (
		<div className="flex flex-col gap-3">
			{posts.map((post) => (
				<PostComponent key={post.id} post={post} />
			))}
		</div>
	);
}

export default PostDisplay;
