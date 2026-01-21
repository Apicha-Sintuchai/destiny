import { getSession } from "@/actions/auth/auth.action";
import { getFortuneTellerSortBySkill } from "@/actions/fortune-teller/fortuneteller.service";
import SignInContainer from "@/containers/SignIn";
import { ForTuneTellerCategory } from "@prisma/client";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const Page = async () => {
    const session = await getSession();

    if (!session) {
        redirect("/");
    }

    const love = await getFortuneTellerSortBySkill({ skill: ForTuneTellerCategory.Love });
    const life = await getFortuneTellerSortBySkill({ skill: ForTuneTellerCategory.Life });
    const finance = await getFortuneTellerSortBySkill({ skill: ForTuneTellerCategory.Finance });
    const career = await getFortuneTellerSortBySkill({ skill: ForTuneTellerCategory.Career });

    return (
        <SignInContainer
            love_fortunteller={love}
            career_fortunteller={career}
            finance_fortunteller={finance}
            life_fortunteller={life}
        />
    );
};

export default Page;
