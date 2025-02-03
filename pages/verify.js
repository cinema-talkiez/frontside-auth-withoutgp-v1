import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FcApproval } from "react-icons/fc";

export default function VerifyPage() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [timer, setTimer] = useState(15); // Start timer at 15 seconds
  const router = useRouter();

  // Handle automatic API call when 5 seconds are left
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
      localStorage.setItem("timer", 0); // Set timer to 0 to enable the button in index.js
    }

    return () => clearInterval(interval);
  }, [timer]);

  // Automatically call API at 5 seconds left
  useEffect(() => {
    if (timer === 5) {
      handleVerification(); // API call when 5 seconds are left
    }
  }, [timer]);

  const handleVerification = async () => {
    setIsVerifying(true);
    setErrorMessage("");

    // Replace with your actual GPLinks API token and callback URL
    const apiToken = "e5bf7301b4ad442d45481de99fd656a182ec6507";
    const callbackUrl = "https://injured-harriet-cinema-talkies-87f4a1d2.koyeb.app/verification-success/"; // The URL where verification success will occur
    const apiUrl = `https://api.gplinks.com/api?api=${apiToken}&url=${encodeURIComponent(callbackUrl)}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`Server responded with ${response.status}`);
      const result = await response.json();

      if (result.status === "success" && result.shortenedUrl) {
        // Open the verification URL in a new tab
        window.open(result.shortenedUrl, "_blank");
      } else {
        throw new Error(result.message || "Verification failed.");
      }
    } catch (error) {
      setErrorMessage(error.message || "An error occurred.");
      setIsVerifying(false);
    }
  };

  return (
    <div className="verificationContainer">
      <div className="verificationBox">
        <h2>Verify Your Access</h2>
        <p>Click the button below to verify yourself and gain access.</p>

        {errorMessage && <p className="error">{errorMessage}</p>}

        <button onClick={handleVerification} disabled={isVerifying || timer <= 0} className="verifyButton">
          <FcApproval className="icon1" />
          {isVerifying ? "Verifying..." : "Verify Now"}
        </button>

        <p>Time left: {timer} seconds</p>
        <p>After verification, you will be redirected back automatically.</p>
      </div>
    </div>
  );
}
