import { useContext, useEffect, useState } from "react";
import { sendRequestToRceServer } from "../../utils/sendRequest";
import { BlogContext } from "../pages/_app";

export default function useTerminal({ containerId, blockNumber, mounted }: {
    containerId: string | undefined, blockNumber: number, mounted: boolean
}) {
    const [terminal, setTerminal] = useState<any>();
    const [terminalCommand, setTerminalCommand] = useState("");
    const [sendTerminalCommand, setSendTerminalCommand] = useState(false);

    const { blockToOutput, setBlockToOutput } = useContext(BlogContext)

    useEffect(() => {
        if (terminal !== undefined) return;

        import("xterm").then((val) => {
            const { Terminal } = val;
            const term = new Terminal({
                disableStdin: false,
                rows: 10,
                cols: 100,
                cursorBlink: true,
                fontWeight: "700"
            });
            const termElement = document.getElementById(
                `terminal-${blockNumber}`
            );
            termElement?.replaceChildren("");
            if (termElement === null) return;
            term.open(termElement);
            term.onKey((key) => {
                // term.clear();
                if (key.key === "\u007f") {
                    term.write("\b \b");
                    // term.clear();

                    setTerminalCommand((prev) =>
                        prev.slice(0, prev.length - 1)
                    );
                    return;
                }
                if (key.key === "\r") {
                    setSendTerminalCommand(true);
                    return;
                }
                setTerminalCommand((prev) => prev + key.key);
                term.write(key.key);
            });
            setTerminal(term);
        });
    }, [mounted, blockNumber]);


    useEffect(() => {
        if (!setBlockToOutput) return
        if (!containerId) {
            setBlockToOutput({ [blockNumber]: "Please enable remote code execution" })
            return
        }

        if (sendTerminalCommand) {
            runShellCommand({ containerId, command: terminalCommand }).then((val) => {

                setBlockToOutput({ [blockNumber]: val })
                setTerminalCommand("")
                setSendTerminalCommand(false)
            })
        }
    }, [sendTerminalCommand])

    useEffect(() => {
        if (!blockToOutput || blockToOutput[blockNumber] === undefined) return
        terminal?.writeln("\r\n" + blockToOutput[blockNumber] || "");
        if (setBlockToOutput) setBlockToOutput({})
    }, [blockToOutput]);



    return {
        terminal
    }
}

async function runShellCommand({
    containerId,
    command,
}: {
    containerId?: string;
    command: string;
}) {


    const resp = await sendRequestToRceServer("POST", {
        language: "shell",
        containerId,
        code: command
    });

    if (resp.status !== 201) {
        return resp.statusText;
    }
    const { output } = (await resp.json()) as { output: string };
    return output
};