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
    
    if (storedValidToken === "true" && storedExpirationTime) {
      if (Date.now() < parseInt(storedExpirationTime)) {
        setValidToken(true);
      } else {
        localStorage.removeItem("validToken");
        localStorage.removeItem("validTokenExpiration");
        setValidToken(false);
      }
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
          if (prev > 0) {
            const newTime = prev - 1;
            return newTime;
          } else {
            clearInterval(interval);
            return 0;
          }
        });
      }, 1000);
    } else if (timer === 0) {
      setValidToken(true);
      localStorage.setItem("validToken", "true");
      localStorage.setItem("validTokenExpiration", Date.now() + 60000); // Token expires in 1 min
    }

    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem("timer"); // Remove timer on close
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const handleVerifyClick = () => {
    setTimer(15);
    router.push("/verify");
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
