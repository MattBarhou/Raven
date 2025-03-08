"use client";
import { useSession } from "next-auth/react";

export default function Profile(second) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <span className="loading loading-spinner align-middle loading-lg"></span>
    );
  }

  if (!session) {
    return <p>Not signed in</p>;
  }
  return (
    <>
      <h1>{session.user.name}</h1>
      <p>{session.user.email}</p>
      <p>{session.user.image}</p>
    </>
  );
}
