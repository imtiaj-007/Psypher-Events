import React, { useMemo, useState } from 'react'
import { CircleLoader } from "react-spinners";
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { tierRank } from "@/constants/user-constants"
import { useUser } from "@/hooks/use-user"
import { Tiers } from "@/types/globals"
import { toast } from 'sonner';


const UpgradeAlert: React.FC = () => {
    const [showTiers, setShowTiers] = useState<boolean>(false);
    const [selectedTier, setSelectedTier] = useState<Tiers | null>(null);
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const { userTier, updateUserTier } = useUser();

    const availableTiers = useMemo(() => Object.keys(tierRank).filter(
        tier => tierRank[tier as Tiers] > tierRank[userTier]
    ) as Tiers[], [userTier]);

    const handleUpgrade = async () => {
        if (!selectedTier) return;
        setLoading(true);
        setShowConfirmation(false);
        try {
            const res = await updateUserTier(selectedTier);
            if (res) {
                setShowTiers(false);
                toast.success(`Your plan is upgraded to ${res}`);
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Something went wrong!');
        } finally {
            setLoading(false);
        }
    };

    if (availableTiers.length === 0) return null;

    return (
        <div className="relative space-y-4 mb-6">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 dark:from-purple-600 dark:to-indigo-700 rounded-lg p-4 shadow-lg">
                <div className="w-full flex items-center justify-between">
                    <div className='space-y-0.5 text-white'>
                        <h3 className="font-bold text-lg">Upgrade for more benefits!</h3>
                        <p className="text-white/90">
                            Unlock premium features by upgrading your account tier.
                        </p>
                    </div>
                    <Button
                        onClick={() => setShowTiers(true)}
                        className="bg-white text-indigo-600 hover:bg-white/90"
                    >
                        Upgrade Now
                    </Button>
                </div>

                {showTiers && (
                    <div className="mt-4 space-y-2 text-white">
                        <h3 className="font-medium">Available Tiers:</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {availableTiers.map(tier => (
                                <div
                                    key={tier}
                                    className='space-y-1 flex flex-col bg-emerald-400 rounded-lg p-4'
                                >
                                    <p className='capitalize text-gray-900'>{tier} Tier</p>
                                    <Button
                                        variant="secondary"
                                        className="ml-auto"
                                        onClick={() => {
                                            setSelectedTier(tier)
                                            setShowConfirmation(true)
                                        }}
                                    >
                                        Choose Plan
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {loading &&
                    <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center gap-6 bg-black/20 z-10">
                        <CircleLoader />
                        <p>Loading.... Please Wait.</p>
                    </div>
                }
            </div>

            <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Upgrade</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to upgrade to {selectedTier} tier?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowConfirmation(false)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleUpgrade}>
                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default UpgradeAlert;