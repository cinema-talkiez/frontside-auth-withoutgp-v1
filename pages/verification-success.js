import { useEffect } from "react";
import { useRouter } from "next/router";

export default function VerificationSuccess() {
  const router = useRouter();

  useEffect(() => {
    // Set validToken in localStorage
    localStorage.setItem("validToken", "true");

    // Set expiration time for 5 minutes
    const expirationTime = Date.now() + 5 * 60 * 1000; // Current time + 5 mins
    localStorage.setItem("validTokenExpiration", expirationTime.toString());

    // Use a slight delay to ensure localStorage is updated before redirecting
    setTimeout(() => {
      router.push("/index1"); // Redirect to homepage
    }, 500); // Delay 500ms to ensure token is stored

  }, [router]);

  return (
    <div className="verification-success">
      <h1>Verification Successful!</h1>
      <p>Your token is now valid. You can access the content.</p>
    </div>
  );
}
