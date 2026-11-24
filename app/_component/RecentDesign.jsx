"use client";

import { useEditorStore } from "../editor/_components/store"
import DesignList from "./Designlist";

function RecentDesigns() {
    const { userDesigns, userDesignsLoading, searchQuery } = useEditorStore();

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">
                {searchQuery.trim() ? "Search results" : "Recent Designs"}
            </h2>
            <DesignList
                listOfDesigns={userDesigns || []}
                isLoading={userDesignsLoading}
                isModalView={false}
                limit={4}
            />
        </div>
    );
}

export default RecentDesigns;
