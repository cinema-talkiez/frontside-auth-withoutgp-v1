import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function VerificationSuccess() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false); // State to control modal visibility

  useEffect(() => {
    // Set validToken in localStorage
    localStorage.setItem("validToken", "true");

    // Set expiration time for 5 minutes
    const expirationTime = Date.now() + 5 * 60 * 1000; // Current time + 5 mins
    localStorage.setItem("validTokenExpiration", expirationTime.toString());

    // Trigger the modal or popup after the token is set
    setTimeout(() => {
      setShowModal(true); // Show the modal after a short delay
    }, 500); // Wait a bit to ensure the token is set before showing the modal

    // Use a slight delay to ensure localStorage is updated before redirecting
    setTimeout(() => {
      router.push("/index1"); // Redirect to homepage
    }, 1500); // Delay 1500ms to allow the modal to show first
  }, [router]);

  return (
    <div className="verification-success">
      <h1>Verification Successful!</h1>
      <p>Your token is now valid. You can access the content.</p>

      {/* Modal Component */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Welcome!</h2>
            <p>Your verification is complete. You're all set!</p>
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

