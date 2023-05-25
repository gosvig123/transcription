import Busboy from "busboy";
import express from "express";
import { Request, Response } from "express";

import {
  handleFileUpload,
  saveTranscription,
  sendTranscript,
} from "./controller/filecontroller";

const router = express.Router();
router.post("/api/transcription", async (req: Request, res: Response) => {
  const busboy = Busboy({ headers: req.headers });

  interface fileType {
    mimeType: string;
  }
  busboy.on(
    "file",
    async (
      filename: string,
      file: NodeJS.ReadableStream,
      fileType: fileType
    ) => {
      const mimeType = fileType.mimeType;

      try {
        const { jobId } = await handleFileUpload(filename, file, mimeType);
        res.status(200).json({
          message: "File uploaded and transcription in progress.",
          jobId,
        });
      } catch (error) {
        res.status(400).json({ error: (error as Error).message });
      }
    }
  );
  req.pipe(busboy);
});

router.post("/webhook", async (req: Request, res: Response) => {
  const jobId: string = req.body.job.id;

  try {
    await saveTranscription(jobId);
    res.status(200).json({ message: "Transcription received and saved." });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while processing the webhook." });
  }
});

router.post("/api/download", async (req: Request, res: Response) => {
  const { jobId } = req.body;

  if (!jobId) {
    return res.status(400).json({ error: "Job ID is required." });
  }

  try {
    const textData = await sendTranscript(jobId);
    res.status(200).send(textData);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
