import {
	LoggedInOptions,
	NotLoggedInOptions,
} from "@components/Navbar/Options";
import SideSheet from "@components/SideSheet";
import { Button } from "@components/ui/button";
import Link from "next/link";

function Home() {
	return (
		<>
			<SideSheet
				notLoggedInChildren={<NotLoggedInOptions />}
				loggedInChildren={<LoggedInOptions />}
			/>
			<div
				className="self-center w-2/3 aspect-video overflow-hidden  my-auto border-border border-2 rounded-sm"
				id="demo-container"
			>
				<video className="w-full" controls>
					<source src="/demo.mp4" type="video/mp4" />
				</video>
			</div>
			<div className="flex self-center gap-10 my-auto">
				<Link href="/write">
					<Button className="w-40 bg-gray-200 hover:bg-gray-500">
						Start Writing
					</Button>
				</Link>
			</div>
		</>
	);
}

export default Home;
