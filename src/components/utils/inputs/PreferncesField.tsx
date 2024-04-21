import React from "react";

const prefrencesIcons: Record<string, string> = {
  night_owl: "https://www.flatmate.in/owl.png",
  party_lover: "https://www.flatmate.in/party.png",
  early_bird: "https://www.flatmate.in/bird.png",
  pet_lover: "https://www.flatmate.in/pet_lover.png",
  studious: "https://www.flatmate.in/books.png",
  vegan: "https://www.flatmate.in/vegan.png",
  music_lover: "https://www.flatmate.in/music_lover.png",
  fitness_freak: "https://www.flatmate.in/dumbbell.png",
  non_alcoholic: "https://www.flatmate.in/non_alcoholic.png",
  sporty: "https://www.flatmate.in/sporty.png",
  wanderer: "https://www.flatmate.in/wanderer.png",
  non_smoker: "https://www.flatmate.in/non_smoker.png",
};

const PreferncesField: React.FC<{ name: string }> = ({ name }) => {
  return (
    <div className="w-36 h-36 flex flex-col items-center justify-center gap-2">
    {" "}
    {/* Set a fixed width */}
        <div
            className={`w-24 h-24 flex items-center justify-center border-2 rounded-full border-stone-500 bg-stone-100`}
        >
            <img
            src={prefrencesIcons[name]}
            alt={name}
            className="w-16 h-16 object-contain"
            />
        </div>
        <span className='capitalize'>{name.replace(/_/g, " ")}</span>
    </div>
  );
};

export default PreferncesField;
