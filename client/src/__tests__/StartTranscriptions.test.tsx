import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import StartTranscription from "components/StartTranscription";

// Mock the fetch function to return a successful response with jobId
global.fetch = jest.fn((input, init) =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ jobId: "12345" }),
  }) as Promise<Response>
);

const createMockFile = (): File => {
  const file = new File(["(⌐□_□)"], "audio.mp3", { type: "audio/mpeg" });
  return file;
};

test("renders StartTranscription component", () => {
  render(<StartTranscription />);
  const title = screen.getByText(/Start a New Transcription/i);
  expect(title).toBeInTheDocument();
});

test("handles invalid file type and shows error message", async () => {
  render(<StartTranscription />);

  const fileInput = screen.getByLabelText(/Upload an audio file/i);
  const invalidFile = new File(["(⌐□_□)"], "invalid.txt", { type: "text/plain" });

  userEvent.upload(fileInput, invalidFile);

  const errorMessage = await screen.findByText(/Please upload a valid audio file./i);
  expect(errorMessage).toBeInTheDocument();
});


interface MockResponseFailure {
  ok: boolean;
  json: () => Promise<{
    message: string;
  }>;
}

test("handles server error and shows error message", async () => {
  const mockResponse: MockResponseFailure = {
    ok: false,
    json: () => Promise.resolve({ message: "An error occurred." }),
  };

  const fetchSpy = jest.spyOn(window, "fetch").mockImplementationOnce(() => Promise.resolve(mockResponse as Response));
  render(<StartTranscription />);
  const fileInput = screen.getByLabelText(/Upload an audio file/i);
  const submitButton = screen.getByText(/Start Transcription/i);
  const validFile = createMockFile();
  userEvent.upload(fileInput, validFile);
  userEvent.click(submitButton);

  await waitFor(() => expect(fetchSpy).toHaveBeenCalledTimes(1));
  expect(fetchSpy).toHaveBeenCalledWith("http://localhost:8080/api/transcription", expect.any(Object));
  

  const errorMessage = await screen.findByText(/An error occurred./i);
  expect(errorMessage).toBeInTheDocument();
  });
  
interface MockResponseSuccess {
  ok: boolean;
  json: () => Promise<{
    jobId: string;
  }>;
}

test("successfully submits a valid file and renders success message", async () => {
  const mockResponse: MockResponseSuccess = {
    ok: true,
    json: () => Promise.resolve({ jobId: "12345" }),
  };
  const fetchSpy = jest.spyOn(window, "fetch").mockImplementationOnce(() => Promise.resolve(mockResponse as Response));
  
  render(<StartTranscription />);

  const fileInput = screen.getByLabelText(/Upload an audio file/i);
  const submitButton = screen.getByText(/Start Transcription/i);
  const validFile = createMockFile();

  userEvent.upload(fileInput, validFile);
  userEvent.click(submitButton);

  await waitFor(() => expect(fetchSpy).toHaveBeenCalledTimes(1));
  expect(fetchSpy).toHaveBeenCalledWith("http://localhost:8080/api/transcription", expect.any(Object));

  await waitFor(() => {
    const successMessage = screen.getByText(/File uploaded successfully./i);
    expect(successMessage).toBeInTheDocument();
  });

  const jobIdText = await screen.findByText(/Store your ID for later retrieval Job ID: 12345/i);
  expect(jobIdText).toBeInTheDocument();

  fetchSpy.mockRestore();
});
