import React, { useState } from "react";

export const DownloadTranscription: React.FC = () => {
  const [jobId, setJobId] = useState("");
  const [downloadMessage, setDownloadMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDownload = async (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();

    if (!jobId) {
      setDownloadMessage("Please provide a Job ID.");
      return;
    }

    setLoading(true);
    setDownloadMessage("");

    try {
      const response = await fetch("http://localhost:8080/api/download", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobId }),
      });

      if (!response.ok) {
        throw new Error("An error occurred while downloading the file.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `transcription_${jobId}.txt`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setDownloadMessage("File downloaded successfully.");
    } catch (error) {
      setDownloadMessage("An error ocurred, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section search-transcriptions">
      <h2>Search Transcriptions</h2>
      <input
        type="text"
        placeholder="Enter Job ID"
        value={jobId}
        onChange={(e) => setJobId(e.target.value)}
        className="id-input"
      />
      <button
        type="submit"
        className="submit-button"
        disabled={loading}
        onClick={handleDownload}
      >
        {loading ? "Processing..." : "Download Transcription"}
      </button>
      {downloadMessage && (
        <div className={loading ? "loading-message" : "success-error-message"}>
          {downloadMessage}
        </div>
      )}
    </div>
  );
};

export default DownloadTranscription;
