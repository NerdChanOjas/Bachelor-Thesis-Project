// import AWS from 'aws-sdk';
import { DeleteObjectCommand, DeleteObjectCommandInput, HeadObjectCommand, ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3';
import crypto from 'crypto';
import path from 'path';
import multer from 'multer';
import multerS3 from 'multer-s3';
// import { S3 } from 'aws-sdk';

// AWS S3 Configuration
// AWS.config.update({
//     region: process.env.AWS_REGION,
//     credentials: {
//         accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
//         secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
//     },
// });

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials:{
       accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
       secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY!
    }
})

// Initialize the AWS S3 client
// const s3Client : S3 = new AWS.S3();

// Define interfaces for the methods
export interface RetrieveParams {
    Bucket: string;
    Prefix?: string;
    Delimiter?: string;
    MaxKeys?: number;
}

export interface RetrieveOneParams {
    Bucket: string;
    Key: string;
}

export interface DeleteParams {
    Bucket: string,
    Key: string
}

// Multer-S3 storage configuration
export const upload = multer({
    storage: multerS3({
        s3: s3Client,
        bucket: 'pii-detection-sih',
        metadata: (_req, file, cb) => { 
            cb(null, { fieldName: file.fieldname });
        },
        key: (_req, file, cb) => {
            const uniqueSuffix = crypto.randomBytes(16).toString('hex');
            cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
        },
    }),
});

// Retrieve objects from S3
export const retrieve = async (params: RetrieveParams) => {
    // const data = await s3Client.listObjectsV2(params).promise();
    try {
        const command = new ListObjectsV2Command(params);
        const data = await s3Client.send(command)
        return data;
    } catch (error) {
        console.error('error deleting file from s3', error instanceof Error ? error.message : error)
    }
};

// Retrieve a single object metadata from S3
export const retrieveOne = async (params: RetrieveOneParams) => {
    try {
        const command = new HeadObjectCommand(params);
        const headData = await s3Client.send(command);
        console.log(headData);
        return headData;
    } catch (error) {
        console.error('error deleting file from s3', error instanceof Error ? error.message : error)
    }
};

export const deleteFromS3 = async (params: DeleteParams) => {
    const deleteParams: DeleteObjectCommandInput = {
        Bucket: params.Bucket,
        Key: params.Key
    };

    try {
        const command = new DeleteObjectCommand(deleteParams);
        const response = await s3Client.send(command)
        return response;
    } catch (error) {
        console.error('error deleting file from s3', error instanceof Error ? error.message : error)
    }
}

// Export the S3 client
export { s3Client };
