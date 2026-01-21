import { getSession } from "@/actions/auth/auth.action";
import { getUserService } from "@/actions/user/user.service";
import { SettingContainer } from "@/containers/setting";
import { redirect } from "next/navigation";

const Page = async () => {
    const session = await getSession();

    if (!session) {
        redirect("/home");
    }

    const { role } = await getUserService(session.id);

    const IsVip = role === "VIP" || role === 'ADMIN';

    return <SettingContainer IsVip={IsVip} />;
};

export default Page;
