import React from "react";

interface SubscriptionData {
  amount: number;
  user_name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

interface subscriptionCardProps {
  subscriptionData: SubscriptionData;
  remainingDays: number | null;
}

const PremiumCard: React.FC<subscriptionCardProps> = ({
  subscriptionData,
  remainingDays,
}) => {
  return (
    <div className="flex flex-col items-center my-10 bg-gradient-to-br from-blue-100 via-orange-100 to-purple-100 p-8 rounded-lg shadow-lg relative border-8 border-orange-200 max-w-md">
      <div>
        <h2 className="font-extrabold text-3xl text-center mb-2">You have premium plan</h2>
        <p className="opacity-60 text-center">Long-term commitment sought.</p>
      </div>
      <div className="flex flex-col gap-2 rounded-lg shadow-md p-4 mt-4">
        <p className="text-lg font-bold">Subscription Benefits:</p>
        <div className="flex flex-col gap-1">
          <p className="text-sm">
            <span className="text-green-600">&#10003;</span> Access to all user
            profiles and details
          </p>
          <p className="text-sm">
            <span className="text-green-600">&#10003;</span> Full website access
            for 1 month
          </p>
        </div>
        {subscriptionData && (
          <div className="border-t pt-2 mt-2">
            <p className="text-lg font-bold mb-2">Subscription Details:</p>
            <p className="text-sm">
              <span className="font-bold">Name:</span>{" "}
              {subscriptionData.user_name}
            </p>
            <p className="text-sm mt-2">
              <span className="font-bold">Start Date:</span>{" "}
              {new Date(subscriptionData.start_date).toLocaleDateString()}
            </p>
            <p className="text-sm mt-2">
              <span className="font-bold">End Date:</span>{" "}
              {new Date(subscriptionData.end_date).toLocaleDateString()}
            </p>
            {remainingDays !== null && (
              <p className="text-sm mt-2">
                <span className="font-bold">Remaining Days:</span>{" "}
                {remainingDays}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PremiumCard;
