import React from "react";

interface FormikInputFieldProps {
  id: string;
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
}

const checkboxIcons: Record<string, string> = {
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

const FormikInputField: React.FC<FormikInputFieldProps> = ({
  id,
  name,
  value,
  checked,
  onChange,
}) => {
  const formattedValue = value.replace(/_/g, " ");

  return (
    <div className="flex items-center justify-center mt-2">
      <div className="w-36 h-36">
        {" "}
        {/* Set a fixed width */}
        <input
          type="checkbox"
          id={id}
          name={name}
          checked={checked}
          onChange={onChange}
          className="hidden"
        />
        <label htmlFor={id} className="cursor-pointer">
          <div
            className={`w-24 h-24 flex items-center justify-center border-2 rounded-full mb-1 ${
              checked ? "border-green-500" : "border-gray-300"
            }`}
          >
            <img
              src={checkboxIcons[id]}
              alt={formattedValue}
              className="w-16 h-16 object-contain"
            />
          </div>
          <span className={`text-black text-sm capitalize p-4 ${
              checked ? "font-semibold" : "font-normal"
            }`}>
            {formattedValue}
          </span>
        </label>
      </div>
    </div>
  );
};

export default FormikInputField;
