import React, { useState } from 'react';
import CustomAlert from './CustomAlert';
import AboutModal from './AboutModal';

export type Character = {
  id: string;
  user_id: string;
  avatar_color: string;
  slot_number: number;
  username?: string;
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

const GitHubIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1"><path d="M12,2.2467A10.00042,10.00042,0,0,0,8.83752,21.73419c.5.08752.6875-.21247.6875-.475,0-.23749-.01251-1.025-.01251-1.86249C7,19.85919,6.35,18.78423,6.15,18.22173A3.636,3.636,0,0,0,5.125,16.8092c-.35-.1875-.85-.65-.01251-.66248A2.00117,2.00117,0,0,1,6.65,17.17169a2.13742,2.13742,0,0,0,2.91248.825A2.10376,2.10376,0,0,1,10.2,16.65923c-2.225-.25-4.55-1.11254-4.55-4.9375a3.89187,3.89187,0,0,1,1.025-2.6875,3.59373,3.59373,0,0,1,.1-2.65s.83747-.26251,2.75,1.025a9.42747,9.42747,0,0,1,5,0c1.91248-1.3,2.75-1.025,2.75-1.025a3.59323,3.59323,0,0,1,.1,2.65,3.869,3.869,0,0,1,1.025,2.6875c0,3.83747-2.33752,4.6875-4.5625,4.9375a2.36814,2.36814,0,0,1,.675,1.85c0,1.33752-.01251,2.41248-.01251,2.75,0,.26251.1875.575.6875.475A10.0053,10.0053,0,0,0,12,2.2467Z"/></svg>
);

const LinkedInIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1"><path d="M20.47,2H3.53A1.45,1.45,0,0,0,2.06,3.43V20.57A1.45,1.45,0,0,0,3.53,22H20.47a1.45,1.45,0,0,0,1.47-1.43V3.43A1.45,1.45,0,0,0,20.47,2ZM8.09,18.74h-3v-9h3ZM6.59,8.48h0a1.56,1.56,0,1,1,0-3.12,1.57,1.57,0,1,1,0,3.12ZM18.91,18.74h-3V13.91c0-1.21-.43-2-1.52-2A1.65,1.65,0,0,0,12.85,13a2,2,0,0,0-.1.73v5h-3s0-8.18,0-9h3V11A3,3,0,0,1,15.46,9.5c2,0,3.45,1.29,3.45,4.06Z"/></svg>
);

export default function MainMenu({ onPlay, onContinue, onCreateCharacter, onSignOut, onDelete, characters, activeCharacter, onBackToMainMenu }: MainMenuProps) {
  const [view, setView] = useState<'start' | 'slots'>('start');
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [isAboutVisible, setIsAboutVisible] = useState(false);

  const renderFooter = () => (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center space-x-6 text-white">
        <a href="https://www.linkedin.com/in/mikko-melgar-447069233" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">
            <LinkedInIcon className="w-7 h-7" />
        </a>
        <a href="https://github.com/Meiko-mlgr/" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">
            <GitHubIcon className="w-7 h-7" />
        </a>
    </div>
  );

  if (view === 'start') {
    return (
      <>
        {isAboutVisible && <AboutModal onClose={() => setIsAboutVisible(false)} />}
        <CustomAlert 
            show={!!alertMessage} 
            message={alertMessage || ''} 
            onClose={() => setAlertMessage(null)} 
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-20">
          <div className="text-center text-white">
             <div className="relative text-center mb-10">
                <h1 className="text-5xl font-bold">Tara, Labas Tayo?</h1>
                <p className="text-lg text-grey-500 italic absolute -bottom-7 right-0">"Come on, let's go out?"</p>
            </div>
            <div className="space-y-4 pt-4">
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
               <button onClick={() => setIsAboutVisible(true)} className="block mx-auto text-2xl hover:text-cyan-400 transition-colors">
                About
              </button>
              <button onClick={onSignOut} className="block mx-auto text-2xl hover:text-cyan-400 transition-colors">
                Sign Out
              </button>
            </div>
          </div>
          {renderFooter()}
        </div>
      </>
    );
  }

  return (
    <>
      {isAboutVisible && <AboutModal onClose={() => setIsAboutVisible(false)} />}
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
                    confirmingDelete === character.id ? (
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