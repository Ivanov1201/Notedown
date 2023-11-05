import { IndexedDbContext } from "@/contexts/IndexedDbContext";
import { Text } from "@codemirror/state";
import { useContext, useState, useEffect } from "react";
import useOwner from "./useOwner";
import { BlogContext } from "@components/BlogPostComponents/BlogState";
import { usePathname, useSearchParams } from "next/navigation";
import { EditorContext } from "@/app/write/components/EditorContext";

export default function useInSync({ markdown }: { markdown: string }) {


    const { blogState } = useContext(BlogContext)
    const { editorState } = useContext(EditorContext)
    const { documentDb } = useContext(IndexedDbContext);

    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { blogMeta: noteMeta } = blogState

    const [inSync, setInSync] = useState(true);
    const owner = useOwner(noteMeta.blogger?.id!)

    // useEffect to check when a note being edited on /write is not synced


    //useEffect to check when a /post is not synced
    useEffect(() => {
        if (!pathname?.startsWith("/post")) return
        if (searchParams?.get("synced") === "false") {
            setInSync(false)
            return
        }
        if (!owner) return
        if (!documentDb) return;
        if (!markdown) return;
        if (!noteMeta.timeStamp) return;

        // let tagPreview = "";
        // if (searchParams?.has("tagpreview")) {
        //     tagPreview = searchParams.get("tagpreview")!;
        // }



        const markdownObjectStoreRequest = documentDb
            .transaction("markdown", "readonly")
            .objectStore("markdown")
            .get(noteMeta.timeStamp);

        markdownObjectStoreRequest.onsuccess = (e) => {
            const { markdown: localMarkdown } = (
                e.target as IDBRequest<{ timeStamp: string; markdown: string }>
            ).result;
            if (localMarkdown !== markdown) {
                setInSync(false);
            }
        };
    }, [documentDb, markdown, owner, blogState]);

    return inSync
}