import { useState } from "react";
import { api } from "../../api/api";

export const SimpleImport = () => {
  const [file, setFile] = useState<File | null>(null);

  const fileOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      alert("Please select a file to import.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    // const reponse = await fetch("/api/upload", {
    //     method: "POST",
    //     body: formData,
    // })

    // if (reponse.ok) {
    //     alert("File uploaded successfully!");
    // } else {
    //     alert("Failed to upload file.");
    // }

    // setFile(null);

    try {
      const response = await api.post(
        "/imports/simple-import-stream",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.status === 200) {
        alert("File imported successfully!");
      } else {
        alert("Failed to import file.");
      }

      setFile(null);
    } catch (error) {
      alert("Failed to import file.");
    }
  };

  return (
    <div>
      <h1>Simple Import</h1>
      <div>
        {/* <form action="/api/upload" method="post" encType="multipart/form-data"> */}
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label htmlFor="file">Select a file to import:</label>
            <input
              type="file"
              id="file"
              name="file"
              onChange={fileOnChange}
              className="input input-bordered"
            />
          </div>

          <div className="flex flex-col gap-2">
            <button className="btn btn-primary" type="submit">
              Import
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
