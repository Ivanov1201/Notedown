import { ALLOWED_LANGUAGES } from "../../utils/constants";
export default interface Post {
    id: number,
    created_at: string,
    created_by: string,
    filename: string,
    title: string,
    description: string
    language: typeof ALLOWED_LANGUAGES[number]
    published: boolean
    published_on: string | null
    image_folder: string | null
    upvote_count: number
    search_index_col: string
}