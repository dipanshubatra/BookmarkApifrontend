import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { useAuth } from "../hooks/useAuth";
import { getErrorMessage } from "../utils/apiError";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successState, setSuccessState] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = String(formData.get("username") ?? "").trim();
    const password = String(formData.get("password") ?? "").trim();

    setIsSubmitting(true);
    setError("");

    try {
      await login({ username, password });
      setSuccessState({
        kind: "login",
        title: "Success",
        message: "You are signed in."
      });
      await new Promise((resolve) => {
        window.setTimeout(resolve, 2200);
      });
      navigate("/dashboard", { replace: true });
    } catch (submitError) {
      setError(getErrorMessage(submitError, "Unable to sign in."));
      setSuccessState(null);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthForm
      title="Sign in"
      subtitle="Sign in to access your bookmarks and continue where you left off."
      submitLabel="Sign in"
      footerPrompt="Need an account?"
      footerLinkLabel="Register"
      footerLinkTo="/register"
      onSubmit={handleSubmit}
      error={error}
      notice=""
      isSubmitting={isSubmitting}
      successState={successState}
    />
  );
}
