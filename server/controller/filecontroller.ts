import fs, { existsSync, readFile as _readFile } from "fs";
import path from "path";
import { promisify } from "util";

import { RevAiApiClient } from "revai-node-sdk";
import { v4 as uuidv4 } from "uuid";

import { callBackUrl } from "../lib/constants";
import { TOKEN } from "../lib/constants";
const client = new RevAiApiClient(TOKEN);

export async function handleFileUpload(
  fileName: string,
  file: NodeJS.ReadableStream,
  mimetype: string
): Promise<{ jobId: string }> {
  try {
    if (
      ![
        "audio/wav",
        "audio/mpeg",
        "audio/mp4",
        "audio/ogg",
        "audio/webm",
      ].includes(mimetype)
    ) {
      throw new Error("Only audio files are accepted.");
    }

    const folderUuid = uuidv4();
    const folderPath = path.join(__dirname, "../uploads", folderUuid);
    fs.mkdirSync(folderPath);

    const savedFilePath = path.join(
      folderPath,
      `audio.${mimetype.split("/")[1]}`
    );
    const writeStream = fs.createWriteStream(savedFilePath);
    file.pipe(writeStream);

    await new Promise((resolve, reject) => {
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });

    const stream = fs.createReadStream(savedFilePath);

    const callbackRoute = (await callBackUrl) + "/webhook";

    const job = await client.submitJobAudioData(stream, fileName, {
      callback_url: callbackRoute,
    });

    const jobId = job.id;

    const newFolderPath = path.join(__dirname, "../uploads", jobId);
    fs.renameSync(folderPath, newFolderPath);
    return { jobId };
  } catch (error) {
    throw new Error("Error uploading the file.");
  }
}

export async function saveTranscription(jobId: string): Promise<void> {
  try {
    const transcriptionResult = await client.getTranscriptObject(jobId);
    const transcriptText = transcriptionResult.monologues
      .flatMap((monologue) => monologue.elements)
      .filter((element) => element.type === "text")
      .map((element) => element.value)
      .join(" ");
    const transcriptFilePath = path.join(
      __dirname,
      "../uploads",
      jobId.toString(),
      "transcription.txt"
    );
    fs.writeFileSync(transcriptFilePath, transcriptText, "utf8");
  } catch (error) {
    throw new Error("Error saving the transcription.");
  }
}

const readFile = promisify(_readFile);

export async function sendTranscript(jobId: string): Promise<string> {
  const transcriptFilePath = path.join(
    __dirname,
    "../uploads",
    jobId.toString(),
    "transcription.txt"
  );
  if (!existsSync(transcriptFilePath)) {
    throw new Error("Transcription file not found.");
  }

  try {
    const data = await readFile(transcriptFilePath, "utf8");
    return data;
  } catch (error) {
    throw new Error("Error reading the file.");
  }
}
