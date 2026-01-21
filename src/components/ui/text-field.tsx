import { Skeleton } from "./skeleton";

export const TextField = ({
    children,
    isLoading,
}: {
    children: React.ReactNode;
    isLoading?: boolean;
}) => {
    if (isLoading) return <Skeleton className="h-[20px] w-[100px] rounded-full" />;

    return <p>{children}</p>;
};
