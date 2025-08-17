// client/src/App.js
import React, { useState } from "react";
import axios from "axios";
import "./App.css"; // Make sure this is using the CSS with the .share-section styles

// The URL you got from deploying your backend on Render
const API_BASE_URL = "https://ai-summarizer-xs7x.onrender.com";

function App() {
  const [transcript, setTranscript] = useState("");
  const [prompt, setPrompt] = useState(""); // Default prompt is empty
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [recipients, setRecipients] = useState("");
  const [statusMessage, setStatusMessage] = useState({ text: "", type: "" });
  const [shareStatusMessage, setShareStatusMessage] = useState({
    text: "",
    type: "",
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTranscript(e.target.result);
        setStatusMessage({ text: "File loaded successfully.", type: "ok" });
      };
      reader.onerror = () => {
        setStatusMessage({ text: "Error reading file.", type: "err" });
      };
      reader.readAsText(file);
    } else if (file) {
      setStatusMessage({
        text: "Please upload a valid .txt file.",
        type: "err",
      });
    }
    event.target.value = null; // Allows re-uploading the same file
  };

  // Helper function to extract wait time from error response
  const getWaitTimeFromError = (error) => {
    let waitTime = 60; // Default fallback

    // Try to get from response data first (our custom handler)
    if (error.response?.data?.retry_after) {
      waitTime = error.response.data.retry_after;
    }
    // Try to get from headers as fallback
    else if (error.response?.headers?.["retry-after"]) {
      waitTime = parseInt(error.response.headers["retry-after"], 10);
    }
    // If still NaN or invalid, use default
    if (isNaN(waitTime) || waitTime <= 0) {
      waitTime = 60;
    }

    return waitTime;
  };

  const handleGenerateSummary = async () => {
    if (!transcript.trim()) {
      setStatusMessage({ text: "Please provide a transcript.", type: "err" });
      return;
    }

    setIsLoading(true);
    setSummary("");
    setStatusMessage({ text: "Generating summary...", type: "" });
    setShareStatusMessage({ text: "", type: "" });

    const effectivePrompt =
      prompt.trim() ||
      "Analyze the following text and create a concise, professional summary. Structure your response with the following sections: First, a section titled 'Key Takeaways' listing the main points and conclusions in bullet points. Second, if any specific tasks, deadlines, or actions are mentioned, create a section titled 'Action Items'. If there are no action items, omit this section.";

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/generate-summary`,
        {
          transcript,
          prompt: effectivePrompt,
        }
      );
      setSummary(response.data.summary);
      setStatusMessage({ text: "Summary generated successfully.", type: "ok" });
    } catch (error) {
      console.error("Error generating summary:", error);

      let message =
        "Something went wrong while generating your summary. Please try again.";

      if (error.response?.status === 429) {
        // Handle rate limiting with user-friendly message
        message =
          "You can only generate 5 summaries per hour due to rate-limiting. Please wait 1 hour before trying again.";
      } else if (error.response?.status >= 500) {
        // Server errors - user-friendly message
        message =
          "Our servers are experiencing issues right now. Please try again in a few minutes.";
      } else if (error.response?.status >= 400) {
        // Client errors - show server message if available, otherwise generic
        if (error.response?.data?.detail) {
          message = error.response.data.detail;
        } else {
          message =
            "There was an issue with your request. Please check your input and try again.";
        }
      } else if (!error.response) {
        // Network/connection errors
        message =
          "Unable to connect to our servers. Please check your internet connection and try again.";
      }

      setStatusMessage({ text: message, type: "err" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    if (!recipients.trim()) {
      setShareStatusMessage({
        text: "Please enter at least one recipient email.",
        type: "err",
      });
      return;
    }

    setShareStatusMessage({ text: "Sending email...", type: "" });

    try {
      const recipientList = recipients.split(",").map((email) => email.trim());
      await axios.post(`${API_BASE_URL}/api/share-summary`, {
        subject: emailSubject.trim() || "Your AI-Generated Meeting Summary",
        summary,
        recipients: recipientList,
      });
      setShareStatusMessage({ text: "Email sent successfully!", type: "ok" });
      setRecipients("");
    } catch (error) {
      console.error("Error sending email:", error);

      let message =
        "Unable to send email. Please check the email addresses and try again.";

      if (error.response?.status === 429) {
        // Handle rate limiting with user-friendly message
        message =
          "You can only send 5 emails per minute due to rate-limiting. Please wait a minute before trying again.";
      } else if (error.response?.status >= 500) {
        // Server errors - user-friendly message
        message =
          "Our email service is experiencing issues right now. Please try again in a few minutes.";
      } else if (error.response?.status >= 400) {
        // Client errors - show server message if available, otherwise generic
        if (error.response?.data?.detail) {
          message = error.response.data.detail;
        } else {
          message =
            "There was an issue with your email request. Please check the email addresses and try again.";
        }
      } else if (!error.response) {
        // Network/connection errors
        message =
          "Unable to connect to our servers. Please check your internet connection and try again.";
      }

      setShareStatusMessage({ text: message, type: "err" });
    }
  };

  const handleClear = () => {
    setTranscript("");
    setSummary("");
    setRecipients("");
    setEmailSubject("");
    setPrompt("");
    setStatusMessage({ text: "", type: "" });
    setShareStatusMessage({ text: "", type: "" });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    setShareStatusMessage({ text: "Summary copied to clipboard!", type: "ok" });
  };

  return (
    <div className="container">
      <h1>AI Meeting Summarizer</h1>
      <p className="subtitle">
        Paste or upload a transcript, generate a summary, and share it
        instantly.
      </p>
      <div className="grid">
        {/* --- LEFT COLUMN: INPUT --- */}
        <div className="input-column">
          <div className="input-group">
            <label htmlFor="prompt">Custom Instruction (Optional)</label>
            <input
              id="prompt"
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Summarize in three key points"
            />
          </div>
          <div className="input-group">
            <label htmlFor="fileInput">Upload Transcript (.txt)</label>
            <input
              id="fileInput"
              type="file"
              accept=".txt"
              onChange={handleFileChange}
            />
          </div>
          <div className="input-group">
            <label htmlFor="textInput">Or Paste Transcript</label>
            <textarea
              id="textInput"
              placeholder="Paste your text here..."
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
            />
          </div>
          <div className="button-row">
            <button
              onClick={handleGenerateSummary}
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? "Generating..." : "Generate Summary"}
            </button>
            <button onClick={handleClear} className="btn-ghost">
              Clear All
            </button>
          </div>
          {statusMessage.text && (
            <p className={`status-message ${statusMessage.type}`}>
              {statusMessage.text}
            </p>
          )}
        </div>
        {/* --- RIGHT COLUMN: OUTPUT --- */}
        <div className="output-column">
          <div className="input-group">
            <label htmlFor="summaryOutput">Generated Summary (Editable)</label>
            <textarea
              id="summaryOutput"
              className="summary-textarea"
              placeholder="Your summary will appear here..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </div>
        </div>
      </div>
      {/* --- NEW SHARE SECTION (Only shows if there is a summary) --- */}
      {summary && (
        <div className="share-section">
          <div className="share-grid">
            <div className="input-group">
              <label htmlFor="subject">Email Subject (Optional)</label>
              <input
                id="subject"
                type="text"
                placeholder="e.g., Summary of Project Phoenix Meeting"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label htmlFor="emails">Recipient Emails (comma-separated)</label>
              <input
                id="emails"
                type="text"
                placeholder="alice@example.com, bob@example.com"
                value={recipients}
                onChange={(e) => setRecipients(e.target.value)}
              />
            </div>
          </div>
          <div className="button-row" style={{ marginTop: "1rem" }}>
            <button
              onClick={handleShare}
              className="btn-secondary"
              disabled={!recipients}
            >
              Send Email
            </button>
            <button onClick={handleCopy} className="btn-ghost">
              Copy Summary
            </button>
          </div>
          {shareStatusMessage.text && (
            <p className={`status-message ${shareStatusMessage.type}`}>
              {shareStatusMessage.text}
            </p>
          )}
        </div>
      )}
      <footer>
        <p>
          Please use this tool responsibly. API requests are rate-limited to
          prevent abuse.
        </p>
      </footer>
    </div>
  );
}

export default App;
