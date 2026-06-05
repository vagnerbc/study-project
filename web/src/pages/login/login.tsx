import type { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";

type LoginFormData = {
  email: string;
  password: string;
};

export function LoginPage() {
  const { login } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>();

  async function onSubmit(data: LoginFormData) {
    try {
      setServerError(null);

      await login({
        email: data.email,
        password: data.password,
      });

      navigate("/app");
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      setServerError(
        axiosError.response?.data.message || "Email or password invalid",
      );
    }
  }

  return (
    <main className="app-shell flex items-center justify-center">
      <div className="auth-card">
        <h1 className="mb-2 text-2xl font-bold">Login</h1>
        <p className="auth-description">
          Entre com sua conta para continuar.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              Email
            </label>

            <input
              id="email"
              type="email"
              className="form-input"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email",
                },
              })}
            />

            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              className="form-input"
              {...register("password", {
                required: "Password is required",
              })}
            />

            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {serverError && (
            <div className="status-box status-error">
              {serverError}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="primary-button w-full"
          >
            {isSubmitting ? "Entrando..." : "Login"}
          </button>
        </form>
      </div>
    </main>
  );
}
