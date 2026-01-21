import { getAccountTopup } from "@/actions/topup/topup.service";
import { TopupContainer } from "@/containers/topup";

const Page = async () => {
    const accountTopup = await getAccountTopup();

    if (!accountTopup) return null;

    return (
        <div className="flex justify-center items-center min-h-screen">
            <TopupContainer accountTopup={accountTopup} />
        </div>
    );
};

export default Page;
