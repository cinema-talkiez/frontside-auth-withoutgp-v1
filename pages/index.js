import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function HomePage() {
  const [verified, setVerified] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Function to check if verification is complete
    const checkVerification = () => {
      if (localStorage.getItem("verificationComplete") === "true") {
        setVerified(true);
      }
    };

    // Run the check on initial load
    checkVerification();

    // Re-check when localStorage changes
    window.addEventListener("storage", checkVerification);

    // Cleanup listener on component unmount
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
