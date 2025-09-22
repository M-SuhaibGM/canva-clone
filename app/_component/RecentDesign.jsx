"use client";

import { useEditorStore } from "../editor/_components/store"
import DesignList from "./Designlist";

function RecentDesigns() {
    const { userDesigns, userDesignsLoading } = useEditorStore();

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Recent Designs</h2>
            <DesignList
                listOfDesigns={
                    userDesigns && userDesigns.length > 0 ? userDesigns.slice(0, 4) : []
                }
                isLoading={userDesignsLoading}
                isModalView={false}
            />
        </div>
    );
}

export default RecentDesigns;
