"use client";
import prepareContainer from "@/app/utils/prepareContainer";
import { BlogProps } from "@/interfaces/BlogProps";
import { useContext } from "react";
import { AiFillEdit } from "react-icons/ai";
import { BiCodeAlt } from "react-icons/bi";
import { TbNews } from "react-icons/tb";
import { BlogContext } from "./BlogState";
import ToolbarButton from "./ToolbarButton";
import Link from "next/link";

function PrivateToolbar(props: { language: BlogProps["language"] }) {
	const { blogState, dispatch } = useContext(BlogContext);
	// const { session } = useSupabase();
	// const user = session?.user;
	return (
		<>
			{props.language && (
				<ToolbarButton
					tip="Enable remote code execution"
					className={``}
					onClick={() =>
						prepareContainer(
							blogState.blogMeta.language,
							blogState.containerId
						).then((containerId) => {
							if (!containerId) return;
							dispatch({
								type: "set containerId",
								payload: containerId,
							});
						})
					}
				>
					<BiCodeAlt
						size={30}
						className={` ${
							blogState.containerId
								? "text-lime-400"
								: "text-black dark:text-white"
						} `}
					/>
				</ToolbarButton>
			)}
			<ToolbarButton className="" tip="Edit markdown">
				<Link href={`/write/${blogState.blogMeta.id}`}>
					<AiFillEdit
						size={28}
						className="dark:text-white  text-black"
					/>
				</Link>
			</ToolbarButton>
			<ToolbarButton className="" tip="Publish">
				<label htmlFor="private-publish">
					<TbNews className=" dark:text-white text-black" size={30} />
				</label>
			</ToolbarButton>
		</>
	);
}

export default PrivateToolbar;