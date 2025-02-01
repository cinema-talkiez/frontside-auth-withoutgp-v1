import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function HomePage() {
  const [validToken, setValidToken] = useState(false);
  const [checkingToken, setCheckingToken] = useState(true);
  const [timer, setTimer] = useState(15); // 15 seconds countdown
  const router = useRouter();

  // Function to check token validity
  const checkTokenValidity = () => {
    const storedValidToken = localStorage.getItem("validToken");
    const storedExpirationTime = localStorage.getItem("validTokenExpiration");

    if (storedValidToken === "true" && storedExpirationTime) {
      if (Date.now() < parseInt(storedExpirationTime)) {
        setValidToken(true); // Token is valid
      } else {
        // Token expired
        setValidToken(false);
        localStorage.removeItem("validToken");
        localStorage.removeItem("validTokenExpiration");
      }
    } else {
      setValidToken(false);
    }
    setCheckingToken(false);
  };

  useEffect(() => {
    checkTokenValidity(); // Check token validity on mount

    const handleStorageChange = () => {
      checkTokenValidity();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []); // Empty dependency array means it runs only on mount

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setValidToken(true); // Enable "Visit HomePage" button after timer ends
    }

    return () => clearInterval(interval); // Cleanup interval
  }, [timer]);

  const handleVerifyClick = () => {
    router.push("/verify"); // Redirect to verify.js
    setTimer(15); // Start the timer when "Verify Now" button is clicked
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
              {timer > 0 && <p>Time left: {timer} seconds</p>}
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
