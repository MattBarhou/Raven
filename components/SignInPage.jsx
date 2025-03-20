"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { FaGithub, FaDiscord, FaEnvelope } from "react-icons/fa";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [isEmailSignIn, setIsEmailSignIn] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState("");

  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect to /home if authenticated
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/home");
    }
  }, [status, router]);

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    setIsSendingEmail(true);

    try {
      const result = await signIn("resend", {
        email,
        redirect: false, // Handle redirect client-side
        callbackUrl: "/home",
      });

      if (result?.error) {
        setError(`Failed to send email: ${result.error}`);
      } else {
        setEmailSent(true);
      }
    } catch (error) {
      console.error("Error sending email:", error);
      setError("An error occurred while sending the email. Please try again.");
    } finally {
      setIsSendingEmail(false);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>; // Optional: Show a loading state
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
          <Image
            src="/raven.png"
            alt="Raven Logo"
            width={200}
            height={200}
            className="w-24 h-24 mb-4"
          />
          <h2 className="card-title">Sign In</h2>
          <p className="mb-4">Sign in with any provider below</p>

          {error && (
            <div className="alert alert-error mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={() => signIn("github", { callbackUrl: "/home" })}
              className="btn btn-neutral gap-2"
            >
              <FaGithub className="w-6 h-6" />
              Sign in with GitHub
            </button>

            <button
              onClick={() => signIn("discord", { redirectTo: "/home" })}
              className="btn bg-[#5865F2] text-white hover:bg-[#4752C4] gap-2"
            >
              <FaDiscord className="w-6 h-6" />
              Sign in with Discord
            </button>

            <div className="divider">OR</div>

            <button
              onClick={() => {
                setIsEmailSignIn(!isEmailSignIn);
                setError("");
                setEmailSent(false);
              }}
              className="btn btn-outline gap-2"
            >
              <FaEnvelope className="w-5 h-5" />
              Sign in with Email
            </button>
          </div>

          {isEmailSignIn && !emailSent && (
            <form onSubmit={handleEmailSignIn} className="mt-4 w-full">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Your Email</span>
                </label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  className="input input-bordered w-full"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary w-full mt-4"
                disabled={isSendingEmail}
              >
                {isSendingEmail ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    Sending Email...
                  </>
                ) : (
                  "Send Sign In Link"
                )}
              </button>
            </form>
          )}

          {emailSent && (
            <div className="alert alert-success mt-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h3 className="font-bold">Check your email!</h3>
                <div className="text-xs">
                  We've sent a sign-in link to {email}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
