import { getSession } from "@/actions/auth/auth.action";
import NoSignInContainer from "@/containers/NoSignIn";
import { redirect } from "next/navigation";

export default async function Home() {
    const session = await getSession();

    if (session) {
        redirect("/home");
    }

    return <NoSignInContainer />;
}
