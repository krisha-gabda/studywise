import { Loader2 } from "lucide-react";

export default function Loading() {
    return(
        <div className="fixed inset-0 bg-page-bg flex items-center justify-center z-50">
            <Loader2 className="w-20 h-20 animate-spin text-primary-text" />
        </div>
    )
}