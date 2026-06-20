"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { GithubIcon, GoogleIcon } from "@/components/icon/Icons";
import { toast } from "react-toastify";

interface OAuthButtonsProps {
  mode?: "signin";
  className?: string;
  buttonClassName?: string;
  redirectUrl?: string;
}

export default function OAuthButtons({
  mode = "signin",
  className = "flex flex-col gap-3",
  buttonClassName = "flex items-center justify-center gap-3 w-full py-3 px-4 border border-outline-variant rounded-lg font-ui-sm text-ui-sm text-on-surface bg-white hover:bg-surface-container-low transition-all cursor-pointer group",
  redirectUrl,
}: OAuthButtonsProps) {
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);

  const next =
    redirectUrl ||
    (typeof window !== "undefined"
      ? window.location.pathname + window.location.search
      : "/dashboard");

  const handleOAuthSignIn = async (provider: "google" | "github") => {
    if (isLoading) return;               // prevent double clicks
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });

    if (error) {
      toast.error(error.message);
      setIsLoading(false);                // re‑enable only on error
    }
    // On success the page will redirect, so we don't need to re‑enable.
  };

  const textPrefix = "Continue with";

  return (
    <div className={className} role="group" aria-label="Sign in with a social provider">
      <button
        type="button"
        onClick={() => handleOAuthSignIn("google")}
        className={buttonClassName}
        disabled={isLoading}
        aria-label={`${textPrefix} Google`}
      >
        <GoogleIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
        {textPrefix} Google
      </button>
      <button
        type="button"
        onClick={() => handleOAuthSignIn("github")}
        className={buttonClassName}
        disabled={isLoading}
        aria-label={`${textPrefix} Github`}
      >
        <GithubIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
        {textPrefix} Github
      </button>
    </div>
  );
}