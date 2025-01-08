import React, { useEffect, useState } from "react";
import { useAuth } from "@/routes/auth/context/AuthProvider";

interface Photo {
  id: number;
  url: string;
}

export const Fotos: React.FC = () => {
  const { user } = useAuth();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    fetch("https://api.example.com/photos")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setPhotos(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching photos:", error);
        setError("Kon de foto's niet ophalen. Probeer het later opnieuw.");
        setIsLoading(false);
      });
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFile = event.target.files[0];
      const maxSizeInMB = 5;
      if (selectedFile.size > maxSizeInMB * 1024 * 1024) {
        setUploadError(
          `Bestandsgrootte mag niet groter zijn dan ${maxSizeInMB} MB`
        );
        setFile(null);
      } else {
        setUploadError(null);
        setFile(selectedFile);
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const response = await fetch("https://api.example.com/upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to upload photo");
      }
      console.log("Photo uploaded successfully");
      // Refresh the photo gallery after successful upload
      const newPhotos = await response.json();
      setPhotos(newPhotos);
    } catch (error) {
      console.error("Error uploading photo:", error);
      setUploadError("Kon de foto niet uploaden. Probeer het later opnieuw.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">{error}</div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-6 p-6">
      <h1 className="text-5xl font-semibold text-center" id="joggings">
        Foto Galerij
      </h1>
      <p className="text-center">
        Bekijk hier de foto's die zijn geüpload door clubs.
      </p>
      {user ? (
        <>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center space-y-4"
          >
            <input type="file" onChange={handleFileChange} />
            {uploadError && <p className="text-red-500">{uploadError}</p>}
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Upload Photo
            </button>
          </form>
        </>
      ) : (
        <p className="text-center text-gray-600">
          U moet ingelogd zijn om foto's te uploaden.
        </p>
      )}
      <div className="photo-gallery grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
        {photos.map((photo) => (
          <img
            key={photo.id}
            src={photo.url}
            alt={`Photo ${photo.id}`}
            className="w-full h-auto rounded shadow"
          />
        ))}
      </div>
    </div>
  );
};
