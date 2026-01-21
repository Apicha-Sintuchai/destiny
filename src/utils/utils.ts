export function shuffleArray<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

export async function UrlToFileImage(url: string | File) {
    if (typeof url === "string") {
        const response = await fetch(url);
        const blob = await response.blob();
        const filename = url.split("/").pop() || "card.jpg";

        return new File([blob], filename, { type: blob.type });
    } else {
        return url;
    }
}
