import { useEffect, useState } from "react";

export default function Verify() {
  const [countdown, setCountdown] = useState(15); // Timer starts from 15 seconds
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }

    // When countdown reaches 5 seconds, call API
    if (countdown === 5) {
      handleVerification();
    }
  }, [countdown]);

  const handleVerification = async () => {
    setIsVerifying(true);
    setErrorMessage("");

    const apiToken = "e5bf7301b4ad442d45481de99fd656a182ec6507"; // Your API token
    const callbackUrl = "https://injured-harriet-cinema-talkies-87f4a1d2.koyeb.app/verification-success/";
    const apiUrl = `https://api.gplinks.com/api?api=${apiToken}&url=${encodeURIComponent(callbackUrl)}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`Server responded with ${response.status}`);
      const result = await response.json();

      if (result.status === "success" && result.shortenedUrl) {
        // Open verification link in a full-screen popup
        const newWindow = window.open(
          result.shortenedUrl,
          "_blank",
          "fullscreen=yes,toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no"
        );

        if (!newWindow) {
          throw new Error("Popup blocked! Allow popups in browser settings.");
        }
      } else {
        throw new Error(result.message || "Verification failed.");
      }
    } catch (error) {
      setErrorMessage(error.message || "An error occurred.");
      setIsVerifying(false);
    }
  };

  return (
    <div className="verify-container">
      <h2>Verification Process</h2>
      <p>Time Remaining: {countdown} seconds</p>

      {countdown === 0 ? (
        <button className="visit-btn" disabled={!isVerifying}>
          Visit Site
        </button>
      ) : (
        <button className="gpverify-btn" disabled={countdown > 5} onClick={handleVerification}>
          {isVerifying ? "Verifying..." : "GP Verify"}
        </button>
      )}

      {errorMessage && <p className="error">{errorMessage}</p>}
    </div>
  );
}
