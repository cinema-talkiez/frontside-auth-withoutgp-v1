import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function VerifyPage() {
  const [timer, setTimer] = useState(15);
  const router = useRouter();

  useEffect(() => {
    let interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    // After 15 sec, mark verification as complete
    setTimeout(() => {
      localStorage.setItem("verificationComplete", "true");
      clearInterval(interval);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>Verification Page</h1>
      <p>Stay on this page for {timer} seconds to complete verification.</p>
      <button onClick={() => router.push("/")}>Go Back</button>
    </div>
  );
}
