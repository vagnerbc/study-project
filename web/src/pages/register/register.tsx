import type { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export function RegisterPage() {
  const { register: registerUser } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>();

  const password = watch("password");

  async function onSubmit(data: RegisterFormData) {
    try {
      setServerError(null);

      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      navigate("/app");
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      setServerError(
        axiosError.response?.data.message || "Could not create account",
      );
    }
  }

  return (
    <main className="app-shell flex items-center justify-center">
      <div className="auth-card">
        <h1 className="mb-2 text-2xl font-bold">Register</h1>
        <p className="auth-description">
          Crie sua conta para acessar o sistema.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium">
              Name
            </label>

            <input
              id="name"
              type="text"
              className="form-input"
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name must have at least 2 characters",
                },
              })}
            />

            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

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
                minLength: {
                  value: 6,
                  message: "Password must have at least 6 characters",
                },
              })}
            />

            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1 block text-sm font-medium"
            >
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              type="password"
              className="form-input"
              {...register("confirmPassword", {
                required: "Confirm password is required",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
            />

            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.confirmPassword.message}
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
            {isSubmitting ? "Criando conta..." : "Register"}
          </button>
        </form>
      </div>
    </main>
  );
}
