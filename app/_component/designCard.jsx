"use client"
import { Loader2, Trash2 } from 'lucide-react';
import React from 'react'
import DesignPreview from './design-preview';
import { useRouter } from "next/navigation";
import { useState } from 'react';
import { deleteDesign } from '@/services/design-service';
const DesignCrad = ({ design, fetchUserDesigns, setShowDesignsModal }) => {
    const router = useRouter();
    const [loading, setloading] = useState(false)

    const handleDeleteDesign = async (getCurrentDesignId) => {
        try {
            setloading(true)
            const response = await deleteDesign(getCurrentDesignId);
            fetchUserDesigns();
        } catch (e) {

        } finally {
            setloading(false)
        }

    };
    return (
        <div className="group cursor-pointer">
            <div
                onClick={() => {
                    router.push(`/editor/${design?.id}`);
                    isModalView ? setShowDesignsModal(false) : null;
                }}
                className="w-[300px] h-[200px]  border-2 rounded-lg mb-2 overflow-hidden transition-shadow group-hover:shadow-md"
            >
                {design?.canvasData && (
                    <DesignPreview key={design.id} design={design} />
                )}
            </div>
            <div className="flex justify-center gap-6">
                <p className="font-bold text-sm truncate">{design.name}</p>
                {loading ? <Loader2 className='animate-spin h-5 w-5' /> : <Trash2
                    onClick={() => handleDeleteDesign(design?.id)}
                    className="w-5 h-5 text-red-400 cursor-pointer "
                />}
            </div>
        </div>
    )
}

export default DesignCrad