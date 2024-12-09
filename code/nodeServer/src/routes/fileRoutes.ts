//module import
import express from 'express';
import { Router } from 'express';
import FileController from '../controllers/fileController';

const router = express.Router();

router.post("/upload", FileController.uploadFile);
router.post("/get-all", FileController.getFiles);
router.post("/get-one", FileController.getOneFile);
router.delete("/delete", FileController.deleteFile);

export default router;