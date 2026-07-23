import React, { useCallback, useEffect, useState } from "react";

export default function SearchPage() {
  const [term, setTerm] = useState("");
  const [count, setCount] = useState(0);
  const [searches, setSearches] = useState<string[]>([]);

  const search = useCallback(
    (term: string) => {
      console.log({ term });
      setCount((value) => ++value);
      setSearches((value) => [...value, term]);
    },
    [setCount],
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (term) search(term);
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [term, search]);

  return (
    <div>
      <form style={{ display: "flex", gap: "8px" }}>
        <input
          type="text"
          name="search"
          id="search"
          value={term}
          onChange={(e) => {
            setTerm(e.target.value);
          }}
          style={{ border: "1px solid" }}
        />
        <div>
          <p>{count}</p>
        </div>
      </form>

      <div>
        <ul>
          {searches.map((search) => (
            <li key={search}>{search}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
