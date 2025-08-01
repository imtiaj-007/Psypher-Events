export const tierRank = {
    free: 0,
    silver: 1,
    gold: 2,
    platinum: 3,
} as const;

export const tierColors = {
    free: "bg-gray-300 text-black",
    silver: "bg-silver text-white",
    gold: "bg-yellow-400 text-black",
    platinum: "bg-purple-600 text-white",
} as const;

export type Tier = keyof typeof tierRank;
