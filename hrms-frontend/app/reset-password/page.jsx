import { Suspense } from "react";
import ResetPasswordPage from "../components/features/pages/ResetPasswordPage.jsx";

// useSearchParams() needs a Suspense boundary so "npm run build" passes
export default function Page() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordPage />
    </Suspense>
  );
}
