"use client"
import { Loader2, Trash2 } from 'lucide-react';
import React, { useState } from 'react'
import DesignPreview from './design-preview';
import { useRouter } from "next/navigation";
import toast from 'react-hot-toast';
import { deleteDesign } from '@/services/design-service';

const DesignCard = ({ design, onDeleted, onOpen }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false)

    const handleOpen = () => {
        onOpen?.();
        router.push(`/editor/${design.id}`);
    };

    const handleDelete = async (e) => {
        e.stopPropagation();
        if (loading) return;
        if (!window.confirm(`Delete "${design.name}"? This can't be undone.`)) return;

        try {
            setLoading(true)
            await deleteDesign(design.id);
            onDeleted?.(design.id);
            toast.success("Design deleted")
        } catch (err) {
            toast.error(err.message || "Failed to delete design")
            setLoading(false)
        }
    };

    return (
        <div className="group min-w-0">
            <div
                role="button"
                tabIndex={0}
                onClick={handleOpen}
                onKeyDown={(e) => { if (e.key === "Enter") handleOpen() }}
                className="relative aspect-[3/2] w-full border rounded-lg mb-2 overflow-hidden bg-white cursor-pointer transition-shadow group-hover:shadow-lg"
            >
                <DesignPreview design={design} />
                <button
                    type="button"
                    onClick={handleDelete}
                    disabled={loading}
                    aria-label={`Delete ${design.name}`}
                    className="absolute top-2 right-2 rounded-full bg-white/90 p-1.5 text-red-500 shadow opacity-0 transition-opacity hover:bg-red-50 group-hover:opacity-100 focus-visible:opacity-100"
                >
                    {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
                </button>
            </div>
            <p className="font-semibold text-sm truncate" title={design.name}>{design.name}</p>
            {design.updatedAt && (
                <p className="text-xs text-gray-500">
                    Edited {new Date(design.updatedAt).toLocaleDateString()}
                </p>
            )}
        </div>
    )
}

export default DesignCard
