import React, { useCallback, useState } from "react";

type Errors = {
  email?: string;
  password?: string;
};

type LoginResponse = {
  accessToken: string;
  message?: string;
};

function SimpleLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors | null>(null);
  const [error, setError] = useState("");

  const validate = () => {
    let validationErrors: Errors = {};
    let isValid = true;
    if (!email || !email.trim()) {
      validationErrors.email = "Email is required";
      isValid = false;
    }

    if (!password) {
      validationErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(validationErrors);
    return isValid;
  };

  const submit = useCallback(
    async (e: React.SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();

      setErrors(null);
      setError("");

      const isValid = validate();

      if (!isValid) {
        return;
      }

      try {
        setLoading(true);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/auth/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              email,
              password,
            }),
          },
        );

        const data = (await response.json()) as LoginResponse;

        if (!response.ok) {
          throw new Error(data.message || "Email or password invalid!");
        }

        console.log(data.accessToken);
      } catch (error: any) {
        console.log("Error while loging");
        setError(error.message);
      } finally {
        setLoading(false);
      }
    },
    [validate],
  );

  return (
    <div className="login">
      <div className="container">
        <div className="header">Enter credentials to login</div>

        <form onSubmit={(e) => submit(e)}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              aria-invalid={Boolean(errors?.email)}
              aria-describedby={errors?.email ? "email-error" : undefined}
            />

            {errors?.email && (
              <div id="email-error" className="error" role="alert">
                {errors.email}
              </div>
            )}
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              aria-invalid={Boolean(errors?.password)}
              aria-describedby={errors?.password ? "password-error" : undefined}
            />

            {errors?.password && (
              <div id="password-error" className="error" role="alert">
                {errors.password}
              </div>
            )}
          </div>

          <div className="field">
            {error && <div className="error">{error}</div>}

            <button type="submit" disabled={loading}>
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SimpleLogin;
