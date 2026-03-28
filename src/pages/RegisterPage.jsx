import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { useAuth } from "../hooks/useAuth";
import { getErrorMessage } from "../utils/apiError";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
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
      await register({ username, password });
      setSuccessState({
        kind: "register",
        title: "Registered",
        message: "Your account is ready. Moving you to sign in."
      });
      await new Promise((resolve) => {
        window.setTimeout(resolve, 1650);
      });
      navigate("/login", { replace: true });
    } catch (submitError) {
      setError(getErrorMessage(submitError, "Unable to register."));
      setSuccessState(null);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthForm
      title="Create account"
      subtitle="Create your account to start saving and organizing bookmarks."
      submitLabel="Register"
      footerPrompt="Already have an account?"
      footerLinkLabel="Sign in"
      footerLinkTo="/login"
      onSubmit={handleSubmit}
      error={error}
      notice=""
      isSubmitting={isSubmitting}
      successState={successState}
    />
  );
}
