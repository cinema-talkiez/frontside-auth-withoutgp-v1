import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function HomePage() {
  const [validToken, setValidToken] = useState(false);
  const [checkingToken, setCheckingToken] = useState(true);
  const [timeLeft, setTimeLeft] = useState(null);
  const router = useRouter();

  // Check token & timer on mount
  useEffect(() => {
    const storedValidToken = sessionStorage.getItem("validToken");
    const storedExpirationTime = sessionStorage.getItem("validTokenExpiration");
    const storedTimer = sessionStorage.getItem("timer");

    // Validate token
    if (storedValidToken === "true" && storedExpirationTime) {
      if (Date.now() < parseInt(storedExpirationTime, 10)) {
        setValidToken(true);
      } else {
        sessionStorage.removeItem("validToken");
        sessionStorage.removeItem("validTokenExpiration");
        setValidToken(false);
      }
    }

    // Restore timer if it exists
    if (storedTimer) {
      const remainingTime = parseInt(storedTimer, 10) - Math.floor(Date.now() / 1000);
      if (remainingTime > 0) {
        setTimeLeft(remainingTime);
      } else {
        sessionStorage.removeItem("timer");
      }
    }

    setCheckingToken(false);
  }, []);

  // Timer countdown effect
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          sessionStorage.removeItem("timer");

          // Grant validToken after countdown ends
          setValidToken(true);
          sessionStorage.setItem("validToken", "true");
          sessionStorage.setItem("validTokenExpiration", Date.now() + 60000);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [timeLeft]);

  // Handle "Verify Now" click
  const handleVerifyClick = () => {
    if (!sessionStorage.getItem("timer")) {
      const countdownTime = 15;
      const expirationTimestamp = Math.floor(Date.now() / 1000) + countdownTime;

      sessionStorage.setItem("timer", expirationTimestamp);
      setTimeLeft(countdownTime);
    }

    router.push("/verify"); // Redirect instantly
  };

  return (
    <div className="container">
      {checkingToken ? (
        <p>Checking token...</p>
      ) : (
        <>
          {!validToken && (
            <>
              <button onClick={handleVerifyClick} className="verifyButton">
                Verify Now
              </button>
              {timeLeft !== null && timeLeft > 0 && <p>Time left: {timeLeft} seconds</p>}
            </>
          )}

          {validToken && (
            <Link href="/index1">
              <button className="visitButton">Visit HomePage</button>
            </Link>
          )}
        </>
      )}
    </div>
  );
}
