import { expect } from "chai";
import sinon from "sinon";

import {
  sendTranscript,
} from "../controller/filecontroller"; // Replace with your functions file

describe("Transcription functions", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("Download Transcript", () => {
    it("should return the content of the transcript file for a given jobId", async () => {
      const jobId = "random";

      const result = await sendTranscript(jobId);
      expect(result).to.equal("Hello world");
    });

    it("should throw an error if the transcript file is not found", async () => {
      const jobId = "67890";
      try {
        await sendTranscript(jobId);
      } catch (error) {
        expect((error as Error).message).to.equal(
          "Transcription file not found."
        );
      }
    });
  });
});
