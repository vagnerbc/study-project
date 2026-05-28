import { useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import type { AxiosError } from "axios";

type ValidationErrors = {
  email: string | undefined;
  password: string | undefined;
  repeatPassword: string | undefined;
};

let initialValidationError = {} as ValidationErrors;

export function SimpleLoginPage() {
  const { login } = useAuth();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [repeatPassword, setRepeatPassword] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState<ValidationErrors>(
    initialValidationError,
  );

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);

      const isValid = validateSubmit();

      if (!isValid) {
        setLoading(false);
        return;
      }

      await login({
        email,
        password,
      });
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;

      const message = axiosError.response?.data.message;
      setError(message || "Email or password invalid");
    } finally {
      setLoading(false);
    }
  };

  const validateSubmit = () => {
    if (!email) {
      setValidationError((value) => ({
        ...value,
        email: "Email is required",
      }));
      return false;
    }

    if (!password) {
      setValidationError((value) => ({
        ...value,
        password: "Password is required",
      }));
      return false;
    }

    if (!repeatPassword) {
      setValidationError((value) => ({
        ...value,
        repeatPassword: "Repeat password is required",
      }));
      return false;
    }

    if (password !== repeatPassword) {
      setValidationError((value) => ({
        ...value,
        repeatPassword: "Repeat password invalid",
      }));
      return false;
    }

    return true;
  };

  return (
    <div>
      <div>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="text"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div>
              <p>{validationError?.email}</p>
            </div>
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div>
              <p>{validationError?.password}</p>
            </div>
          </div>

          <div>
            <label htmlFor="repeatPassword">Repeat Password</label>
            <input
              type="repeatPassword"
              name="repeatPassword"
              id="repeatPassword"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
            />
            <div>
              <p>{validationError?.repeatPassword}</p>
            </div>
          </div>

          <div>
            <div>
              <p>{error}</p>
            </div>
            <button type="submit" disabled={loading}>
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
