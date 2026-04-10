export interface BusinessIdea {
  id: string;
  name: string;
  description: string;
  imagePrompt: string;
  imageUrl?: string;
  potential: number; // 1-5
  location: string;
  estimatedProfit: string;
  executionSteps: string[];
  targetMarket: string;
  sellingStrategy: string;
  tips: string[];
  feasibilityScore: number; // 1-100
  sevenDayPlan: string[];
  profitSimulation: {
    sellingPrice: number;
    targetSales: number;
    estimatedRevenue: number;
    estimatedProfit: number;
  };
  badges: string[];
}

export interface UserInput {
  modal: string;
  skill: string;
  location: string;
}
