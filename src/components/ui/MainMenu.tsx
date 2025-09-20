// src/components/ui/MainMenu.tsx (New File)
type MainMenuProps = {
  onPlay: () => void;
  onCreateCharacter: () => void;
  onSignOut: () => void;
  hasCharacter: boolean;
};

export default function MainMenu({ onPlay, onCreateCharacter, onSignOut, hasCharacter }: MainMenuProps) {
  return (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-20">
      <div className="text-center text-white">
        <h1 className="text-5xl font-bold mb-8">Tara, Labas Tayo?</h1>
        <div className="space-y-4">
          {hasCharacter ? (
            <button onClick={onPlay} className="text-2xl hover:text-cyan-400 transition-colors">
              Play
            </button>
          ) : (
            <button onClick={onCreateCharacter} className="text-2xl hover:text-cyan-400 transition-colors">
              Create Character
            </button>
          )}
          {/* Add Character Slots/Customization logic here later */}
          <button onClick={onSignOut} className="block mx-auto text-2xl hover:text-cyan-400 transition-colors">
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}