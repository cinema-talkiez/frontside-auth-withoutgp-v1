import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function VerifyPage() {
  const [timer, setTimer] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedTimer = localStorage.getItem("timer");
    if (storedTimer) {
      setTimer(parseInt(storedTimer));
    }

    const interval = setInterval(() => {
      const updatedTimer = localStorage.getItem("timer");
      if (updatedTimer) {
        setTimer(parseInt(updatedTimer));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>Verification Page</h1>
      {timer !== null && timer > 0 && <p>Time left: {timer} seconds</p>}
      {timer === 0 && <p>Verification complete! You can return to the homepage.</p>}
    </div>
  );
}
