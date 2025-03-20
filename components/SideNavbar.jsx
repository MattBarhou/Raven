"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaUser, FaSignOutAlt, FaPlus } from "react-icons/fa";
import ThemeToggle from "./ThemeToggle";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import PostModal from "./PostModal";

const SideNavbar = ({ refreshPosts }) => {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const handleCloseModal = () => {
    setIsOpen(false);
    if (refreshPosts) refreshPosts();
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false }); // Disable server-side redirect
    router.push("/"); // Manually redirect client-side
  };

  if (status === "loading") {
    return <span className="loading loading-spinner loading-lg"></span>;
  }

  return (
    <>
      <div className="w-40 h-screen bg-base-200 p-6 flex flex-col justify-between">
        <ul className="menu flex flex-col gap-6">
          {/* Home Button with Raven Logo */}
          <li>
            <Link href="/" className="flex flex-col text-center">
              <Image
                src="/raven.png"
                alt="Raven Logo"
                width={100}
                height={100}
                style={{ borderRadius: "50%" }}
              />
              Raven
            </Link>
          </li>

          {/* Profile Button */}
          <li>
            <Link
              href="/profile"
              className="flex justify-center p-2 hover:bg-base-400 rounded"
            >
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt="User Profile"
                  width={30}
                  height={30}
                  className="rounded-full"
                />
              ) : (
                <FaUser size={30} /> // Fallback Icon
              )}
              <span className="ml-2">Profile</span>
            </Link>
          </li>

          {/* Create Post Button */}
          {session?.user?.name ? (
            <li>
              <button
                onClick={() => setIsOpen(true)}
                className="flex items-center p-2 hover:bg-base-300 rounded w-full text-left"
              >
                <FaPlus className="mr-2" size={25} />
                New Post
              </button>
            </li>
          ) : (
            <span className="text-center">Not signed in.</span>
          )}

          {/* Logout Button */}
          <li>
            <button
              onClick={handleSignOut}
              className="flex justify-center p-2 hover:bg-base-400 rounded w-full text-left"
            >
              <FaSignOutAlt className="mr-2" size={20} />
              Logout
            </button>
          </li>

          {/* Theme Toggle */}
          <li className="flex justify-start p-2 space-x-2">
            <ThemeToggle />
          </li>
        </ul>
      </div>
      {/* Post Modal */}
      <PostModal isOpen={isOpen} onClose={handleCloseModal} />
    </>
  );
};

export default SideNavbar;
