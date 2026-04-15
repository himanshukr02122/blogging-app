"use client";

import { useEffect, useState } from "react";
import Snackbar from "../ui/Snackbar";
import { healthCheck } from "@/lib/auth";

type SnackbarState = {
  title: string;
  description: string;
};

const BackendWakingUp = () => {
  const [snackbar, setSnackbar] = useState<SnackbarState | null>({
    title: "Waking things up...",
    description:
      "Our backend is currently starting up after being idle. This can take up to a minute. Thanks for your patience — things will be ready shortly!",
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const checkBackend = async () => {
      try {
        const res = await healthCheck();
        if (res.status === "ok") {
          // ✅ Backend is ready
          setSnackbar({
            title: "You're all set 🚀",
            description: "Everything is up and running. You can continue now!",
          });

          clearInterval(interval);

          // auto hide after 3 sec
          setTimeout(() => setSnackbar(null), 3000);
        }
      } catch (err) {
        // still waking up → ignore
      }
    };

    // check immediately + every 5 sec
    checkBackend();
    interval = setInterval(checkBackend, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {snackbar && (
        <Snackbar
          title={snackbar.title}
          description={snackbar.description}
          onClose={() => setSnackbar(null)}
        />
      )}
    </>
  );
};

export default BackendWakingUp;