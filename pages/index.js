import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function HomePage() {
  const [validToken, setValidToken] = useState(false);
  const [checkingToken, setCheckingToken] = useState(true);
  const [timeLeft, setTimeLeft] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedValidToken = sessionStorage.getItem("validToken");
    const storedExpirationTime = sessionStorage.getItem("validTokenExpiration");
    const storedTimer = sessionStorage.getItem("timer");

    if (storedValidToken === "true" && storedExpirationTime) {
      if (Date.now() < parseInt(storedExpirationTime)) {
        setValidToken(true);
      } else {
        sessionStorage.removeItem("validToken");
        sessionStorage.removeItem("validTokenExpiration");
        setValidToken(false);
      }
    }

    if (storedTimer) {
      const remainingTime = parseInt(storedTimer) - Math.floor(Date.now() / 1000);
      if (remainingTime > 0) {
        setTimeLeft(remainingTime);
      } else {
        sessionStorage.removeItem("timer");
      }
    }

    setCheckingToken(false);
  }, []);

  useEffect(() => {
    let interval;
    if (timeLeft !== null && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setValidToken(true);
            sessionStorage.setItem("validToken", "true");
            sessionStorage.setItem("validTokenExpiration", Date.now() + 60000);
            sessionStorage.removeItem("timer");
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timeLeft]);

  const handleVerifyClick = () => {
    if (!timeLeft) {
      const countdownTime = 15;
      const expirationTimestamp = Math.floor(Date.now() / 1000) + countdownTime;

      sessionStorage.setItem("timer", expirationTimestamp); // Store timer in sessionStorage
      setTimeLeft(countdownTime);
    }

    router.push("/verify"); // Ensure redirection happens instantly
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
