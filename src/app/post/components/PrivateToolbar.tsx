"use client";
import EnableRceButton from "@components/BlogPostComponents/EnableRceButton";
import { ToolTipComponent } from "@components/ToolTipComponent";
import Link from "next/link";
import { useContext } from "react";
import { AiFillEdit } from "react-icons/ai";
import { BlogContext } from "../../../components/BlogPostComponents/BlogState";

function PrivateToolbar() {
	const { blogState } = useContext(BlogContext);
	return (
		<>
			{blogState.blogMeta.language && <EnableRceButton />}
			<ToolTipComponent
				tip="Edit markdown"
				className={`text-gray-400 hover:text-white active:scale-95`}
			>
				<Link href={`/write/${blogState.blogMeta.id}`}>
					<AiFillEdit size={28} />
				</Link>
			</ToolTipComponent>
		</>
	);
}

export default PrivateToolbar;
