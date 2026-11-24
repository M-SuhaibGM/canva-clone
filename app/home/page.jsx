"use client"
import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import Banner from '../_component/Banner'
import Sidebar from '../_component/Sidebar'
import Header from '../_component/Header'
import DesignType from '../_component/Design-types'
import AiFeatures from '../_component/AiFeatures'
import RecentDesign from '../_component/RecentDesign'
import DesignModal from '../_component/designs-modal'
import SubscriptionModal from '../editor/_components/premium-modal'
import { useEditorStore } from '../editor/_components/store'
import { getUserSubscription } from '@/services/subscription-service'
import { getUserDesigns } from '@/services/design-service'

const Home = () => {
    const {
        setUserSubscription,
        setUserDesigns,
        showPremiumModal,
        setShowPremiumModal,
        showDesignsModal,
        setShowDesignsModal,
        userDesigns,
        setUserDesignsLoading,
        userDesignsLoading,
        setSearchQuery,
    } = useEditorStore();

    useEffect(() => {
        let cancelled = false;

        // Start from a clean search every time the dashboard opens.
        setSearchQuery("");

        const load = async () => {
            setUserDesignsLoading(true);
            try {
                const [subscription, designs] = await Promise.allSettled([
                    getUserSubscription(),
                    getUserDesigns(),
                ]);
                if (cancelled) return;

                if (subscription.status === "fulfilled" && subscription.value?.success) {
                    setUserSubscription(subscription.value.data);
                }
                if (designs.status === "fulfilled") {
                    setUserDesigns(designs.value);
                } else {
                    toast.error(designs.reason?.message || "Failed to load your designs");
                }
            } finally {
                if (!cancelled) setUserDesignsLoading(false);
            }
        };

        load();
        return () => { cancelled = true };
    }, [setUserSubscription, setUserDesigns, setUserDesignsLoading, setSearchQuery]);

    return (
        <div className='flex min-h-screen bg-white'>
            <Sidebar />
            <div className="flex flex-1 min-w-0 flex-col ml-[72px]">
                <Header />
                <main className="p-4 sm:p-6 pt-24 flex-1 w-full max-w-[1400px] mx-auto">
                    <Banner />
                    <DesignType />
                    <AiFeatures />
                    <RecentDesign />
                </main>
            </div>
            <SubscriptionModal
                isOpen={showPremiumModal}
                onClose={setShowPremiumModal}
            />
            <DesignModal
                isOpen={showDesignsModal}
                onClose={setShowDesignsModal}
                userDesigns={userDesigns}
                setShowDesignsModal={setShowDesignsModal}
                userDesignsLoading={userDesignsLoading}
            />
        </div >
    )
}
export default Home
