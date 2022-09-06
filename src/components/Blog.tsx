import { useEffect, useMemo, useRef, useState } from "react";
import htmlToJsx from "../../utils/htmlToJsx";
import { sendRequestToRceServer } from "../../utils/sendRequest";
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
}: Partial<BlogProps>) {
	const [collectCodeTillBlock, setCollectCodeTillBlock] =
		useState<(blockNumber: number) => void>();
	const [blockToOutput, setBlockToOutput] = useState<Record<number, string>>(
		{}
	);
	const [blockToCode, setBlockToCode] = useState<Record<number, string>>({});
	const [runningCode, setRunningCode] = useState(false);
	const [runningBlock, setRunningBlock] = useState<number>();

	const blogJsx = useMemo(() => {
		if (!content) return <></>;
		return htmlToJsx({
			html: content,
			language: language!,
			ownerId: created_by!,
			imageFolder: image_folder || undefined,
		});
	}, []);

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
		if (!runningCode || !runningBlock || !language || !containerId) return;
		const runCodeRequest = async (blockNumber: number) => {
			console.log(blockToCode);
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
		runCodeRequest(runningBlock).then(() => {
			setRunningBlock(undefined);
			setRunningCode(false);
		});
	}, [runningCode]);

	return (
		<BlogContext.Provider
			value={{ blockToOutput, setBlockToCode, collectCodeTillBlock }}
		>
			<div
				className={` prose  max-w-none basis-3/5 lg:px-28 prose-headings:text-amber-500  prose-p:text-justify text-white prose-a:text-lime-500
				prose-strong:text-violet-500 prose-strong:font-bold prose-pre:m-0 prose-pre:p-0  prose-blockquote:text-yellow-400  h-full overflow-y-auto prose-p:text-lg prose-figcaption:mb-6 prose-h1:mb-6 prose-code:bg-black prose-code:text-yellow-400 prose-code:font-mono prose-ul:text-lg
				`}
			>
				<h1 className="text-center" id="title">
					{title}
				</h1>
				<div className="mb-20 text-center italic text-xl w-full">
					{description}
				</div>
				<div className="" id="jsx">
					{blogJsx}
				</div>
			</div>
		</BlogContext.Provider>
	);
}