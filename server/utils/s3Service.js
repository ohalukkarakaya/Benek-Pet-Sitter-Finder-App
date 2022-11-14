import aws from "@aws-sdk/client-s3";

const s3 = new aws.S3(
    {
        forcePathStyle: true,
        endpoint: process.env.S3_ENDPOINT,
        region: "us-east-1",
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        }
    }
);

export default s3;