import DownloadTranscription from "components/DownloadTranscription";
import StartTranscription from "components/StartTranscription";
function App() {
  return (
    <div className="container">
      <h1 className="title">Transcription, when accuracy matters!</h1>
      <div className="sections">
        <StartTranscription />
        <DownloadTranscription />
      </div>
    </div>
  );
}

export default App;
