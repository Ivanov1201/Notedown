import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SUPABASE_BLOGGER_TABLE } from "../../utils/constants";
import getImagesFromLexica from "../../utils/getImagesFromLexica";
import htmlToJsx from "../../utils/htmlToJsx";
import { sendRequestToRceServer } from "../../utils/sendRequest";
import { supabase } from "../../utils/supabaseClient";
import Blogger from "../interfaces/Blogger";
import { BlogProps } from "../interfaces/BlogProps";
import { BlogContext } from "../pages/_app";

export function Blog({
	title,
	description,
	content,
	language,
	containerId,
	created_by,
	image_folder,
	bloggers,
	imageToUrl,
}: Partial<BlogProps>) {
	const [collectCodeTillBlock, setCollectCodeTillBlock] =
		useState<(blockNumber: number) => void>();
	const [blockToOutput, setBlockToOutput] = useState<Record<number, string>>(
		{}
	);
	const [blockToCode, setBlockToCode] = useState<Record<number, string>>({});
	const [runningCode, setRunningCode] = useState(false);
	const [runningBlock, setRunningBlock] = useState<number>();
	const [author, setAuthor] = useState<string>();

	useEffect(() => {
		const captions: string[] = [];
		const lexicaImageElems = Array.from(
			document.getElementsByClassName("lexica")
		);
		if (!lexicaImageElems || lexicaImageElems.length === 0) return;
		lexicaImageElems.map((elem) => {
			captions.push((elem as HTMLImageElement).alt);
		});
		getImagesFromLexica({ caption: captions[0] }).then((imageLink) => {
			(lexicaImageElems.at(0) as HTMLImageElement).src = imageLink || "";
		});
	}, [content]);

	const blogJsx = useMemo(() => {
		if (!content) return <></>;
		return htmlToJsx({
			html: content,
			language: language || "python",
			ownerId: created_by!,
			imageFolder: image_folder || undefined,
			imageToUrl,
		});
	}, [content]);

	useEffect(() => {
		const func = (blockNumber: number) => {
			setBlockToCode({});
			const event = new Event("focus");
			for (let i = 0; i <= blockNumber; i++) {
				const elem = document.getElementById(
					`run-${i}`
				) as HTMLButtonElement | null;
				if (!elem) continue;
				elem.dispatchEvent(event);
			}
			setRunningBlock(blockNumber);
			setRunningCode(true);
		};
		setCollectCodeTillBlock(() => func);
	}, []);

	useEffect(() => {
		fetchAuthor();
	}, [created_by]);

	const runCodeRequest = async (
		blockNumber: number,
		blockToCode: Record<number, string>
	) => {
		let code = Object.values(blockToCode).join("\n");
		code = code.trim();

		let sessionCodeToOutput = sessionStorage.getItem(code);
		if (sessionCodeToOutput) {
			setBlockToOutput({ [blockNumber]: sessionCodeToOutput });
			setBlockToCode({});
			return;
		}
		const params: Parameters<typeof sendRequestToRceServer> = [
			"POST",
			{ language, containerId, code },
		];
		const resp = await sendRequestToRceServer(...params);

		if (resp.status !== 201) {
			setBlockToOutput({ [blockNumber]: resp.statusText });
			return;
		}
		const { output } = (await resp.json()) as { output: string };
		try {
			sessionStorage.setItem(code, output);
		} catch {}

		setBlockToOutput({ [blockNumber]: output });
		setBlockToCode({});
	};

	useEffect(() => {
		if (
			!runningCode ||
			runningBlock === undefined ||
			!language ||
			!containerId
		) {
			setRunningBlock(undefined);
			setRunningCode(false);
			return;
		}
		runCodeRequest(runningBlock, blockToCode).then(() => {
			setRunningBlock(undefined);
			setRunningCode(false);
		});
	}, [runningCode]);

	const fetchAuthor = async () => {
		//fetching author here because author may have changed his displayname
		// and I will blow my head off before attempting to revalidate each one of his single posts
		//just because that maniac changed his username from josh to joshua

		const { data } = await supabase
			.from<Blogger>(SUPABASE_BLOGGER_TABLE)
			.select("name")
			.eq("id", created_by || "");
		if (data) setAuthor(data.at(0)?.name || undefined);
	};

	return (
		<BlogContext.Provider
			value={{
				containerId,
				blockToOutput,
				setBlockToCode,
				collectCodeTillBlock,
				setBlockToOutput,
			}}
		>
			<div
				className={`scroll-smooth prose prose-sm md:prose-base max-w-none px-2 lg:px-20 prose-headings:text-amber-500 prose-p:text-left text-white prose-a:text-lime-500
				prose-strong:text-purple-500 prose-strong:font-black prose-pre:m-0 prose-pre:p-0  prose-blockquote:text-amber-400  h-full overflow-y-auto prose-p:text-sm prose-figcaption:mb-6 prose-h1:mb-6 prose-code:bg-black prose-code:text-yellow-500 prose-code:font-mono md:prose-p:text-lg md:prose-ul:text-lg 
				prose-code:select-all
				pb-20 md:pb-10 prose-em:text-cyan-500`}
			>
				<h1 className="text-center" id="title">
					{title}
				</h1>
				<div className="text-center italic text-lg md:text-xl w-full font-semibold">
					{description}
				</div>
				<div className="flex gap-1 not-prose text-xs md:text-sm justify-center mb-10 md:mb-12 mt-8 font-mono">
					<span>by</span>
					<span className="link link-hover">
						<Link href={`/profile/${created_by}`}>
							{author || bloggers?.name || ""}
						</Link>
					</span>
				</div>
				<div className="" id="jsx">
					{blogJsx}
				</div>
			</div>
		</BlogContext.Provider>
	);
}
