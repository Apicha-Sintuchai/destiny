export const base64ToBuffer = (data: string) => {
    const base64Data = data.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    return buffer;
};

export const fileToBuffer = async (data: File) => {
    const arrayBuffer = await data.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return buffer;
};
