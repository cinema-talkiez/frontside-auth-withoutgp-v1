import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function HomePage() {
  const [verified, setVerified] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if verification was completed
    const checkVerification = () => {
      if (localStorage.getItem("verificationComplete") === "true") {
        setVerified(true);
      }
    };

    checkVerification();
    window.addEventListener("storage", checkVerification);

    return () => window.removeEventListener("storage", checkVerification);
  }, []);

  return (
    <div>
      {!verified ? (
        <button onClick={() => router.push("/verify")}>Verify Now</button>
      ) : (
        <Link href="/index1">
          <button>Visit HomePage</button>
        </Link>
      )}
    </div>
  );
}
