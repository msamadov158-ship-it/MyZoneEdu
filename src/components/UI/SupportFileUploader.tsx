'use client';

import { useRef, useState } from 'react';
import { Loader2,CirclePlus } from 'lucide-react';
import { uploadFileToFirebase } from '@/lib/helpers/uploadImage';

interface FileUploaderProps {
    folder: string;
    onUploaded: (url: string) => void;
}

export const FileUploader = ({ folder, onUploaded }: FileUploaderProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleSelectFile = () => {
        inputRef.current?.click();
    };

    const handleUpload = async (file: File) => {
        try {
            setUploading(true);
            const url = await uploadFileToFirebase(file, folder, setProgress);
            onUploaded(url);
        } finally {
            setUploading(false);
            setProgress(0);
        }
    };

    return (
        <>
            <button type="button" onClick={handleSelectFile} disabled={uploading} className="p-3 rounded-full border-0 border-gray-200 hover:bg-gray-100 transition" >
                {uploading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
                ) : (
                    <CirclePlus className="w-5 h-5 text-gray-600" />
                )}
            </button>

            <input
                ref={inputRef}
                type="file"
                className="hidden"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(file);
                }}
            />
        </>
    );
};
