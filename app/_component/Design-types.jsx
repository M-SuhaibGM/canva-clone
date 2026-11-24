"use client";

import { designTypes } from "@/app/config";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import useCreateDesign from "@/hooks/useCreateDesign";

function DesignTypes() {
    const [currentSelectedType, setCurrentSelectedType] = useState(-1);
    const { create, loading } = useCreateDesign();

    const handleCreateNewDesign = (type, index) => {
        if (loading) return;
        setCurrentSelectedType(index);
        create({
            name: type.label,
            width: type.width,
            height: type.height,
            category: type.label,
        });
    };

    return (
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-4 mt-10">
            {designTypes.map((type, index) => (
                <button
                    type="button"
                    onClick={() => handleCreateNewDesign(type, index)}
                    key={type.label}
                    disabled={loading}
                    className="group flex cursor-pointer flex-col items-center disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    <div
                        className={`${type.bgColor} w-14 h-14 rounded-full flex items-center justify-center mb-2 transition-transform group-hover:scale-110 group-hover:shadow-md`}
                    >
                        {loading && currentSelectedType === index ? (
                            <Loader2 className="h-6 w-6 animate-spin text-white" />
                        ) : (
                            type.icon
                        )}
                    </div>
                    <span className="text-xs text-center text-gray-700">{type.label}</span>
                </button>
            ))}
        </div>
    );
}

export default DesignTypes;
