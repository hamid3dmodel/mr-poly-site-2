"use client";

import { useRef, useState } from "react";

type MediaFieldProps = {
    value?: string;
    onChange: (value: string) => void;
};

export default function MediaField({
                                       value,
                                       onChange,
                                   }: MediaFieldProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    async function handleUpload(
        event: React.ChangeEvent<HTMLInputElement>,
    ) {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        setUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/editor/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Upload failed");
            }

            onChange(data.url);
        } catch (error) {
            console.error(error);
            alert("Image upload failed.");
        } finally {
            setUploading(false);

            if (inputRef.current) {
                inputRef.current.value = "";
            }
        }
    }

    return (
        <div className="mr-poly-media-field">
            {value && (
                <div className="mr-poly-media-preview">
                    <img src={value} alt="" />
                </div>
            )}

            <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                className="mr-poly-upload-button"
            >
                {uploading
                    ? "Uploading..."
                    : value
                        ? "Replace Image"
                        : "Upload Image"}
            </button>

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="mr-poly-file-input"
            />
        </div>
    );
}