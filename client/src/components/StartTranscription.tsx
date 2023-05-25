import React, { ChangeEvent, FormEvent, useState } from "react";

const StartTranscription: React.FC = () => {
  const [jobId, setJobId] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploadMessage, setUploadMessage] = useState("");

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (
      file &&
      [
        "audio/wav",
        "audio/mpeg",
        "audio/mp4",
        "audio/ogg",
        "audio/webm",
      ].includes(file.type)
    ) {
      setFileError("");
      setFile(file);
    } else {
      setFileError("Please upload a valid audio file.");
      setFile(null);
    }
  };

  const uploadTranscription = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      setUploadMessage("Please provide a file.");
      return;
    }

    setLoading(true);
    setUploadMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response: Response = await fetch(
        "http://localhost:8080/api/transcription",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!data.jobId) {
        throw new Error("An error occurred while uploading the file.");
      }

      setFile(null);
      setUploadMessage("File uploaded successfully.");

      // Set the jobId from the parsed data
      setJobId(data.jobId);
    } catch (error) {
      setUploadMessage((error as Error).message);
    }

    setLoading(false);
  };

  const copyJobId = () => {
    navigator.clipboard.writeText(jobId).then(
      () => {
        alert("Job ID copied to clipboard.");
      },
      () => {
        alert("Failed to copy Job ID to clipboard.");
      }
    );
  };

  return (
    <div className="section start-transcription">
      <h2>Start a New Transcription</h2>
      <div className="file-typ des">
        Upload an audio file and start transcribing!
      </div>
      <form onSubmit={uploadTranscription}>
        <div className="file-input-container">
          <input
            type="file"
            onChange={handleFileChange}
            data-testid="file-input"
            className="file-input"
            id="file-input"
          />
          <label htmlFor="file-input" className="file-label">
            {file ? file.name : "Upload an audio file"}
          </label>
          <p className="audioTypes">
            Supported audio file types: WAV, MP3, MP4, OGG, WEBM
          </p>
        </div>

        {fileError && (
          <div data-testid="error-message" className="error-message">
            {fileError}
          </div>
        )}
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Uploading..." : "Start Transcription"}
        </button>
        {uploadMessage && (
          <div
            data-testid="message"
            className={loading ? "loading-message" : "success-error-message"}
          >
            {uploadMessage}
          </div>
        )}
      </form>
      {jobId && (
        <div>
          <p>Store your ID for later retrieval Job ID: {jobId}</p>
          <button className="submit-button" onClick={copyJobId}>
            Copy Job ID
          </button>
        </div>
      )}
    </div>
  );
};

export default StartTranscription;
