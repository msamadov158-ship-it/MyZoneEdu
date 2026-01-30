import { File } from "lucide-react";

export const MessageFileRenderer = ({ file_path }: { file_path?: string }) => {
    const getFileType = (url: string) => {
        if (url?.match(/\.(png|jpg|jpeg|webp)$/i)) return 'image';
        if (url?.match(/\.(mp4|webm|ogg)$/i)) return 'video';
        return 'document';
    };

    const type = getFileType(file_path as string);

    if (type === 'image') {
        return (
            <img src={file_path} alt="image" className="rounded-xl max-h-60 cursor-pointer hover:opacity-90" onClick={() => window.open(file_path, '_blank')} />
        );
    }

    if (type === 'video') {
        return (
            <video src={file_path} controls className="rounded-xl max-h-64 w-full" />
        );
    }

    return (
        <a href={file_path} download target="_blank" className="flex items-center gap-3 border rounded-xl p-3 cursor-pointer">
            <File className="w-5 h-5 text-blue-500" />
            <span className="text-sm">Faylni yuklab olish</span>
        </a>
    );
};