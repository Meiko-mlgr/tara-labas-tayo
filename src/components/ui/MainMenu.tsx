import React, { useState } from 'react';
import CustomAlert from './CustomAlert';

export type Character = {
  id: string;
  avatar_color: string;
  slot_number: number;
};

type MainMenuProps = {
  onPlay: (character: Character) => void;
  onContinue: () => void;
  onCreateCharacter: (slot: number) => void;
  onSignOut: () => void;
  onDelete: (characterId: string) => void; 
  characters: (Character | null)[];
  activeCharacter: Character | null;
  onBackToMainMenu: () => void;
};

const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14" />
        <path d="M12 5v14" />
    </svg>
);

export default function MainMenu({ onPlay, onContinue, onCreateCharacter, onSignOut, onDelete, characters, activeCharacter, onBackToMainMenu }: MainMenuProps) {
  const [view, setView] = useState<'start' | 'slots'>('start');
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null); // State for the custom alert

  if (view === 'start') {
    return (
      <>
        <CustomAlert 
            show={!!alertMessage} 
            message={alertMessage || ''} 
            onClose={() => setAlertMessage(null)} 
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-20">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-8">Tara, Labas Tayo?</h1>
            <div className="space-y-4">
            {activeCharacter ? (
                <>
                  <button onClick={onContinue} className="text-2xl hover:text-cyan-400 transition-colors">
                    Continue
                  </button>
                  <button onClick={() => setView('slots')} className="block mx-auto text-2xl hover:text-cyan-400 transition-colors">
                    Change Character
                  </button>
                </>
              ) : (
                <button onClick={() => setView('slots')} className="text-2xl hover:text-cyan-400 transition-colors">
                  Start
                </button>
              )}
              <button onClick={onSignOut} className="block mx-auto text-2xl hover:text-cyan-400 transition-colors">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <CustomAlert 
        show={!!alertMessage} 
        message={alertMessage || ''} 
        onClose={() => setAlertMessage(null)} 
      />
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-20">
        <div className="text-center text-white w-full max-w-4xl">
          <h2 className="text-4xl font-bold text-gray-300 mb-12">Select a Character</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(slotNumber => {
              const character = characters.find(c => c?.slot_number === slotNumber);
              return (
                <div key={slotNumber} className="bg-white/10 rounded-lg p-6 flex flex-col items-center justify-between min-h-[250px]">
                  {character ? (
                    // If a character exists in the slot
                    confirmingDelete === character.id ? (
                      // Confirmation prompt
                      <div className="flex flex-col items-center justify-center h-full">
                        <p className="text-lg mb-4">Are you sure?</p>
                        <div className="w-full space-y-2">
                          <button
                            onClick={() => {
                              onDelete(character.id);
                              setConfirmingDelete(null);
                            }}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
                          >
                            Yes, Delete
                          </button>
                          <button
                            onClick={() => setConfirmingDelete(null)}
                            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-24 h-24 rounded-full mb-4" style={{ backgroundColor: character.avatar_color }}></div>
                        <span className="text-xl font-semibold mb-2">Character {slotNumber}</span>
                        <div className="w-full space-y-2 mt-auto">
                          <button 
                            onClick={() => onPlay(character)} 
                            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded transition-colors"
                          >
                            Play
                          </button>
                          <button
                            onClick={() => {
                              if (activeCharacter?.id === character.id) {
                                setAlertMessage("You cannot delete a character that is currently in use.");
                                return;
                              }
                              setConfirmingDelete(character.id)}
                            }
                            className="w-full bg-gray-800 hover:bg-red-800/50 text-gray-300 font-bold py-2 px-4 rounded transition-colors text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )
                  ) : (
                    // Display empty slot
                    <>
                      <div className="flex-grow flex items-center justify-center">
                          <button 
                          onClick={() => onCreateCharacter(slotNumber)}
                          className="w-24 h-24 rounded-full border-2 border-dashed border-gray-400 hover:border-white hover:text-white text-gray-400 flex items-center justify-center transition-colors"
                          >
                              <PlusIcon className="w-10 h-10" />
                          </button>
                      </div>
                      <span className="text-xl font-semibold">Empty Slot</span>
                    </>
                  )}
                </div>
              );
            })}
          </div>
          <button onClick={() => { setView('start'); onBackToMainMenu(); }} className="block mx-auto text-xl hover:text-cyan-400 transition-colors mt-12">
              Back to Main Menu
          </button>
        </div>
      </div>
    </>
  );
}