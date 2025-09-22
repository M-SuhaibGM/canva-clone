"use client"
import React from 'react'
import Banner from '../_component/Banner'
import Sidebar from '../_component/Sidebar'
import Header from '../_component/Header'
import DesignType from '../_component/Design-types'
import AiFeatures from '../_component/AiFeatures'
import RecentDesign from '../_component/RecentDesign'
import DesignModal from '../_component/designs-modal'
import SubscriptionModal from '../editor/_components/premium-modal'
import { useEffect } from 'react'
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
    } = useEditorStore();

    const fetchUserSubscription = async () => {
        const response = await getUserSubscription();

        if (response.success) setUserSubscription(response.data);
    };

    async function fetchUserDesigns() {
        setUserDesignsLoading(true);
        const result = await getUserDesigns();
        setUserDesigns(result);
        setUserDesignsLoading(false);

    }

    useEffect(() => {
        fetchUserSubscription();
        fetchUserDesigns();
    }, []);
    return (
        <div className='flex min-h-screen bg-white'>
            <Sidebar />
            <div className="flex flex-1 flex-col ml-[72px] ">
                <Header />
                <main className=" p-6  pt-20 overflow-y-auto flex-1">
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