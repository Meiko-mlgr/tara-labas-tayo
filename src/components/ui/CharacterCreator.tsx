import React from 'react';

type CharacterCreatorProps = {
  avatarColor: string;
  setAvatarColor: (color: string) => void;
  onSave: () => void;
  onBack: () => void;
};

const colorOptions = [
  { name: 'Red', value: '#EF4444' },
  { name: 'Green', value: '#22C55E' },
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Yellow', value: '#EAB308' },
  { name: 'Sky Blue', value: '#87CEEB' },
  { name: 'Tomato', value: '#FF6347' },
];
export default function CharacterCreator({ avatarColor, setAvatarColor, onSave, onBack }: CharacterCreatorProps) {
  return (

    <div className="absolute top-0 right-0 bottom-0 w-full max-w-md bg-black/70 backdrop-blur-lg flex flex-col justify-center p-8 z-20 text-white">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-8">Create Your Character</h2>
        
        <div className="mb-8">
          <p className="text-lg mb-4">Choose a color:</p>
          <div className="flex justify-center space-x-4">
            {colorOptions.map((color) => (
              <button
                key={color.name}
                onClick={() => setAvatarColor(color.value)}
                className={`w-12 h-12 rounded-full border-4 transition-all`}
                style={{ 
                  backgroundColor: color.value,
                  borderColor: avatarColor === color.value ? 'white' : 'transparent' 
                }}
                aria-label={`Select color ${color.name}`}
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <button onClick={onSave} className="text-2xl hover:text-cyan-400 transition-colors">
            Save
          </button>
          <button onClick={onBack} className="block mx-auto text-xl text-gray-400 hover:text-white transition-colors">
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
}