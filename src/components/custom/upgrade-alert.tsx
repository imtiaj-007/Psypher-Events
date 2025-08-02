import React, { useMemo, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Loader } from '@/components/ui/loader';
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogFooter, 
    DialogHeader, 
    DialogTitle 
} from "@/components/ui/dialog"
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

    const availableTiers = useMemo(() => userTier
        ? Object.keys(tierRank).filter(
            tier => tierRank[tier as Tiers] > tierRank[userTier]
        ) as Tiers[]
        : null,
        [userTier]);

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
            window.location.reload();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Something went wrong!');
        } finally {
            setLoading(false);
        }
    };

    if (!availableTiers || availableTiers.length === 0) return null;

    return (
        <div className="relative space-y-4 mb-6">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 dark:from-purple-600 dark:to-indigo-700 rounded-lg p-4 shadow-lg">
                <div className="w-full flex items-center justify-between">
                    <div className='space-y-0.5 text-white'>
                        <h3 className="font-bold text-base">Upgrade for more benefits!</h3>
                        <p className="text-white/90 text-sm">
                            Unlock premium events by upgrading your account tier.
                        </p>
                    </div>
                    <Button
                        onClick={() => setShowTiers(!showTiers)}
                        className="bg-white text-indigo-600 hover:bg-white/90"
                    >
                        {showTiers ? 'Cancel' : 'Upgrade Now'}
                    </Button>
                </div>

                {showTiers && (
                    <div className="mt-4 space-y-2 text-white">
                        <h3 className="font-medium">Available Tiers:</h3>
                        {loading
                            ? <Loader variant="grid" message="Loading... Please wait" />
                            : <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {availableTiers.map(tier => (
                                    <div
                                        key={tier}
                                        className='space-y-1 flex flex-col bg-emerald-400 rounded-lg p-4'
                                    >
                                        <p className='capitalize font-medium text-gray-800'>{tier} Tier</p>
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
                        }
                    </div>
                )}
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