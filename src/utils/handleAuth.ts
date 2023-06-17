import { SupabaseClient } from "@supabase/supabase-js"
import { SupabaseAuthClient } from "@supabase/supabase-js/dist/module/lib/SupabaseAuthClient"

export const handleSignIn = async (supabaseClient: SupabaseClient, provider: "github" | "google", redirectTo: string) => {
    const hostname = window.location.hostname
    let redirectUrl
    if (hostname === "localhost") {
        redirectUrl = `http://localhost:3000${redirectTo}`
    } else {
        redirectUrl = `${window.location.protocol}//${window.location.hostname}${redirectTo}`
    }

    const { error } = await supabaseClient.auth.signInWithOAuth(
        {
            provider,
            options: {
                redirectTo
            }
        },

    );
    if (error) {
        alert(error.message);
        return;
    }
}

export const handleLogout = async (supabaseClient: SupabaseClient) => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
        alert(error.message);
        console.log(error);
        return;
    }
};

// export const notifyServer = (event: AuthChangeEvent, session: Session | null) => {
//     fetch("/api/auth", {
//         method: "POST",
//         headers: new Headers({
//             "Content-Type": "application/json",
//         }),
//         credentials: "same-origin",
//         body: JSON.stringify({ event, session }),
//     }).catch((err) => console.log(err.message));
// }