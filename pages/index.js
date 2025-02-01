import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function HomePage() {
  const [validToken, setValidToken] = useState(false);
  const [checkingToken, setCheckingToken] = useState(true);
  const [timer, setTimer] = useState(null);
  const router = useRouter();

  // Function to check token validity
  const checkTokenValidity = () => {
    const storedValidToken = localStorage.getItem("validToken");
    const storedExpirationTime = localStorage.getItem("validTokenExpiration");
    const storedTimer = localStorage.getItem("timer");

    if (storedValidToken === "true" && storedExpirationTime) {
      if (Date.now() < parseInt(storedExpirationTime)) {
        setValidToken(true);
      } else {
        localStorage.removeItem("validToken");
        localStorage.removeItem("validTokenExpiration");
        setValidToken(false);
      }
    }

    if (storedTimer) {
      setTimer(parseInt(storedTimer));
    }

    setCheckingToken(false);
  };

  useEffect(() => {
    checkTokenValidity();

    const handleStorageChange = () => {
      checkTokenValidity();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    let interval;
    if (timer !== null && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          const newTime = prev - 1;
          localStorage.setItem("timer", newTime);
          return newTime;
        });
      }, 1000);
    } else if (timer === 0) {
      setValidToken(true);
      localStorage.setItem("validToken", "true");
      localStorage.setItem("validTokenExpiration", Date.now() + 60000); // Set token expiry (1 min for demo)
      localStorage.removeItem("timer");
    }

    return () => clearInterval(interval);
  }, [timer]);

  const handleVerifyClick = () => {
    localStorage.setItem("timer", 15);
    setTimer(15);
    router.push("/verify"); // Redirect to verify.js
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
              {timer !== null && timer > 0 && <p>Time left: {timer} seconds</p>}
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
