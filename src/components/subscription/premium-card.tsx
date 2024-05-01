import React from 'react'

const PremiumCard = ({subscriptionData, remainingDays}) => {
  return (
    <div
        className="flex flex-col items-center my-10 bg-gradient-to-br from-blue-100 via-orange-100 to-purple-100 p-8 rounded-lg shadow-lg relative border-8 border-orange-200 max-w-sm">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"
            className="w-20 h-20 absolute -top-11 -left-11 fill-red-400">
            <path fill-rule="evenodd"
                d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177A7.547 7.547 0 016.648 6.61a.75.75 0 00-1.152-.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248zM15.75 14.25a3.75 3.75 0 11-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 011.925-3.545 3.75 3.75 0 013.255 3.717z"
                clip-rule="evenodd"></path>
        </svg>
        <p className="mono text-sm absolute -top-4 bg-red-400 text-zinc-100 py-0.5 px-2 font-bold tracking-wider rounded">
            POPULAR
        </p>
        <div>
        <h2 className="font-extrabold text-3xl text-center mb-2">Premium</h2>
        <p className="opacity-60 text-center">Long-term commitment sought.</p>
        <div className="flex gap-4 justify-center">
          <div className="flex flex-col items-center my-8">
            <p className="font-extrabold text-4xl">
              &#8377; {subscriptionData.amount}
            </p>
            <p className="text-sm opacity-60">/2 month</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <p className="flex items-center text-sm">
          <b>Access to all user profiles and details</b>
        </p>
        <p className="flex items-center text-sm">
          <b>Full website access for 2 month</b>
        </p>
        {subscriptionData && (
          <div>
            <p>User: {subscriptionData.user_name}</p>
            <p>
              Start Date:{" "}
              {new Date(subscriptionData.start_date).toLocaleDateString()}
            </p>
            <p>
              End Date:{" "}
              {new Date(subscriptionData.end_date).toLocaleDateString()}
            </p>
            {remainingDays !== null && <p>Remaining Days: {remainingDays}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default PremiumCard