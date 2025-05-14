import {Request, Response} from 'express';
import db from '../db/index'
import { medicalRecordMetadataTable, medicalRecordTable } from '../db/schema';
import { deleteFromS3, DeleteParams, retrieve, retrieveOne, RetrieveOneParams, RetrieveParams } from '../config/awsConfig';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from "uuid";

interface fileMetadata {
    patient_id: string;
    record_id: string;
    uploaded_by: string;
    record_type: string;
    s3url: string;
    description: string;
    keywords: any;
    embedded_vector: any
    created_at: Date;
    updated_at: Date;
}

export class FileController{
    static async uploadFile(req: Request, res: Response) {
        try {
            const result = await db.transaction(async (tx) => {
                let record_id = "rid"+uuidv4();
                const [insertedFile] = await tx.insert(medicalRecordTable).values({
                    record_id: record_id,
                    patient_id: req.body.patient_id,
                    uploaded_by: req.body.user_id,
                    record_type: req.body.record_type,
                    file_url: req.body.file_url,
                    description: req.body.description
                }).returning();

                const [insertedMetaDataFile] = await tx.insert(medicalRecordMetadataTable).values({
                    record_id: insertedFile.record_id,
                    embedded_vector: req.body.embedded_vector,
                    keyword: req.body.keywords,
                }).returning();

                return {file: insertedFile, metadata: insertedMetaDataFile}
            })

            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({
                message: 'file upload failed',
                error: error instanceof Error ? error.message : error
            });
        }
    }

    static async getFiles( req: Request, res: Response ) {
        const params : RetrieveParams = {
            Bucket: process.env.AWS_BUCKET!
        }
        try {
            const data = await retrieve(params);
            if (data == undefined) throw Error;
            const files = data.Contents?.map((file) => {
                return {
                    key: file.Key,
                    url: `https://${params.Bucket}.s3.amazonaws.com/${file.Key}`, // File URL
                    lastModified: file.LastModified,
                    size: file.Size,
                }
            });

            res.status(200).json({
                message: 'files list retrieved',
                file: files
            })
            
        } catch (error) {
            res.status(400).json({
                message: 'files retrieval failed',
                error: error instanceof Error ? error.message : error
            });
        }
    }

    static async getOneFile(req: Request, res: Response) {
        const params : RetrieveOneParams = {
            Bucket: process.env.AWS_BUCKET!,
            Key: req.body.key,
        }

        try {
            const data = await retrieveOne(params);
            if (!data) throw Error;

            const fileUrl = `https://${params.Bucket}.s3.amazonaws.com/${req.body.key}`;

            res.json({
                message: 'file retrieved',
                file: { 
                    key: req.body.key,
                    url: fileUrl,
                    lastModified: data.LastModified, 
                    size: data.ContentLength
                }
            })
        } catch (error) {
            res.status(400).json({
                message: 'file retrival failed',
                error: error instanceof Error ? error.message : error
            });
        }
    }

    static async deleteFile(req: Request, res: Response) : Promise<any> {
        try {
            const { key } = req.body;

            if (!key) {
                return res.status(400).json({
                    message: 'file key is required'
                });
            }

            await db.transaction(async (tx) => {
                await tx.delete(medicalRecordTable).where(eq(medicalRecordTable.record_id, key));
                await tx.delete(medicalRecordMetadataTable).where(eq(medicalRecordMetadataTable.record_id, key));
            });
            const deleteParams : DeleteParams = {
                Bucket: process.env.AWS_BUCKET!,
                Key: key 
            }

            await deleteFromS3(deleteParams);

            res.status(200).json({
                message: 'File deleted successfully',
                key: key
            });

        } catch (error){
            console.error('file deletion error', error);
            res.status(500).json({
                message: 'problem in deleting file',
                error: error instanceof Error ? error.message : error
            })
        }
    }
}

export default FileController;