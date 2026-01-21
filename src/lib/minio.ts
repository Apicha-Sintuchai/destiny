import { Client } from "minio";
import { requireEnv } from "./env";

let minioClient: Client | null = null;

function getMinioClient(): Client {
    if (!minioClient) {
        minioClient = new Client({
            endPoint: requireEnv("MINIO_ENDPOINT"),
            port: parseInt(requireEnv("MINIO_PORT") || "9000"),
            useSSL: requireEnv("MINIO_USE_SSL") === "true",
            accessKey: requireEnv("MINIO_ACCESS_KEY"),
            secretKey: requireEnv("MINIO_SECRET_KEY"),
        });
    }
    return minioClient;
}

export const uploadFile = async (bucketName: string, objectName: string, buffer: Buffer) => {
    try {
        const client = getMinioClient();
        const bucketExists = await client.bucketExists(bucketName);

        if (!bucketExists) {
            await client.makeBucket(bucketName, "us-east-1");

            console.log(`Bucket ${bucketName} created successfully.`);
        }

        await client.putObject(bucketName, objectName, buffer);
        console.log(`File ${objectName} uploaded successfully to bucket ${bucketName}.`);
    } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
    }
};

export const getFileUrl = async (bucketName: string, objectName: string) => {
    try {
        const client = getMinioClient();
        const url = await client.presignedGetObject(bucketName, objectName, 24 * 60 * 60);
        return url;
    } catch (error) {
        console.error("Error getting file URL:", error);
        throw error;
    }
};

export const deleteFile = async (bucket: string, objectName: string) => {
    try {
        const client = getMinioClient();

        await client.removeObject(bucket, objectName);
    } catch (error) {
        console.error("Error deleting file:", error);
        throw error;
    }
}
