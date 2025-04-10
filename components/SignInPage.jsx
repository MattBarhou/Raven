"use client";

import Image from "next/image";
import { FaGithub, FaDiscord } from "react-icons/fa";
import { signIn } from "next-auth/react";

export default function SignInPage() {
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

          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={() => signIn("github", { callbackUrl: "/home" })}
              className="btn btn-neutral gap-2"
            >
              <FaGithub className="w-6 h-6" />
              Sign in with GitHub
            </button>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={() => signIn("discord", { callbackUrl: "/home" })}
              className="btn btn-primary gap-2"
            >
              <FaDiscord className="w-6 h-6" />
              Sign in with Discord
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
