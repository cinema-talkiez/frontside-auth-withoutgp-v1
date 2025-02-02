import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function HomePage() {
  const [validToken, setValidToken] = useState(false);
  const [checkingToken, setCheckingToken] = useState(true);
  const [timer, setTimer] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedValidToken = sessionStorage.getItem("validToken");
    const storedExpirationTime = sessionStorage.getItem("validTokenExpiration");

    if (storedValidToken === "true" && storedExpirationTime) {
      if (Date.now() < parseInt(storedExpirationTime)) {
        setValidToken(true);
      } else {
        sessionStorage.removeItem("validToken");
        sessionStorage.removeItem("validTokenExpiration");
        setValidToken(false);
      }
    }
    setCheckingToken(false);
  }, []);

  useEffect(() => {
    let interval;
    if (timer !== null && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setValidToken(true);
            sessionStorage.setItem("validToken", "true");
            sessionStorage.setItem("validTokenExpiration", Date.now() + 60000);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timer]);

  const handleVerifyClick = () => {
    setTimer(15); // Start timer

    // Delay navigation slightly to ensure timer starts properly
    setTimeout(() => {
      router.push("/verify");
    }, 100);
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
