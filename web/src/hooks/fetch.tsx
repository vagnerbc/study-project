import { useEffect, useState } from "react";

export function useFetch(url: RequestInfo | URL, options?: RequestInit) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const exec = async () => {
      setError(null);

      try {
        setLoading(true);

        const response = await fetch(url, options);

        if (!response.ok) {
          throw new Error("Request error");
        }

        const json = await response.json();

        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    exec();
  }, [url]);

  return {
    data,
    loading,
    error,
  };
}
