import React from 'react';

type AboutModalProps = {
  onClose: () => void;
};

// --- Updated SVG Icons for Tech Stack ---
const NextjsIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="45" height="40"><path d="M11.214.006c-.052.005-.216.022-.364.033-3.408.308-6.6 2.147-8.624 4.974a11.9 11.9 0 0 0-2.118 5.243c-.096.66-.108.854-.108 1.748s.012 1.089.108 1.748c.652 4.507 3.86 8.293 8.209 9.696.779.251 1.6.422 2.533.526.364.04 1.936.04 2.3 0 1.611-.179 2.977-.578 4.323-1.265.207-.105.247-.134.219-.157a212 212 0 0 1-1.955-2.62l-1.919-2.593-2.404-3.559a343 343 0 0 0-2.422-3.556c-.009-.003-.018 1.578-.023 3.51-.007 3.38-.01 3.516-.052 3.596a.43.43 0 0 1-.206.213c-.075.038-.14.045-.495.045H7.81l-.108-.068a.44.44 0 0 1-.157-.172l-.05-.105.005-4.704.007-4.706.073-.092a.6.6 0 0 1 .174-.143c.096-.047.133-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 2 2.895 4.362l4.734 7.172 1.9 2.878.097-.063a12.3 12.3 0 0 0 2.465-2.163 11.95 11.95 0 0 0 2.825-6.135c.096-.66.108-.854.108-1.748s-.012-1.088-.108-1.748C23.24 5.75 20.032 1.963 15.683.56a12.6 12.6 0 0 0-2.498-.523c-.226-.024-1.776-.05-1.97-.03m4.913 7.26a.47.47 0 0 1 .237.276c.018.06.023 1.365.018 4.305l-.007 4.218-.743-1.14-.746-1.14V10.72c0-1.983.009-3.097.023-3.151a.48.48 0 0 1 .232-.296c.097-.05.132-.054.5-.054.347 0 .408.005.486.047" />
  </svg>
);
export const ThreejsIcon = () => (
  <svg
    width="50"
    height="50"
    strokeLinecap="square"
    strokeMiterlimit="10"
    viewBox="0 0 226.77 226.77"
  >
    <g transform="translate(8.964 4.2527)" fillRule="evenodd" stroke="grey" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="7">
      <path d="m63.02 200.61-43.213-174.94 173.23 49.874z" />
      <path d="m106.39 50.612 21.591 87.496-86.567-24.945z" />
      <path d="m84.91 125.03-10.724-43.465 43.008 12.346z" />
      <path d="m63.458 38.153 10.724 43.465-43.008-12.346z" />
      <path d="m149.47 62.93 10.724 43.465-43.008-12.346z" />
      <path d="m84.915 125.06 10.724 43.465-43.008-12.346z" />
    </g>
  </svg>
);
export const SupabaseIcon = () => (
  <svg width="40" height="40" viewBox="0 0 109 113" fill="none">
    <path
      d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z"
      fill="url(#paint0_linear)"
    />
    <path
      d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z"
      fill="url(#paint1_linear)"
      fillOpacity="0.2"
    />
    <path
      d="M45.317 2.07103C48.1765 -1.53037 53.9745 0.442937 54.0434 5.041L54.4849 72.2922H9.83113C1.64038 72.2922 -2.92775 62.8321 2.1655 56.4175L45.317 2.07103Z"
      fill="#bed1c9"
    />
    <defs>
      <linearGradient
        id="paint0_linear"
        x1="53.9738"
        y1="54.974"
        x2="94.1635"
        y2="71.8295"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#7D8F87" />
        <stop offset="1" stopColor="#C6D6CF" />
      </linearGradient>
      <linearGradient
        id="paint1_linear"
        x1="36.1558"
        y1="30.578"
        x2="54.4844"
        y2="65.0806"
        gradientUnits="userSpaceOnUse"
      >
        <stop />
        <stop offset="1" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);

export const TailwindIcon = () => (
  <svg width="45" height="40" fill="none" viewBox="0 0 54 33">
    <path
      fill="#f2f8fa"
      fillRule="evenodd"
      d="M27 0c-7.2 0-11.7 3.6-13.5 10.8 2.7-3.6 5.85-4.95 9.45-4.05 2.054.513 3.522 2.004 5.147 3.653C30.744 13.09 33.808 16.2 40.5 16.2c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C36.756 3.11 33.692 0 27 0zM13.5 16.2C6.3 16.2 1.8 19.8 0 27c2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C17.244 29.29 20.308 32.4 27 32.4c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C23.256 19.31 20.192 16.2 13.5 16.2z"
      clipRule="evenodd"
    />
  </svg>
);

const CloseIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="mb-8">
        <h3 className="text-2xl font-bold text-cyan-300 mb-4 border-b-2 border-cyan-300/20 pb-2">{title}</h3>
        <div className="text-gray-300 space-y-3 leading-relaxed">
            {children}
        </div>
    </div>
);

export default function AboutModal({ onClose }: AboutModalProps) {
  const techStack = [
    { name: 'Next.js', icon: <NextjsIcon/>, description: 'Framework (with TypeScript)' },
    { name: 'Three.js', icon: <ThreejsIcon />, description: '3D Graphics (with R3F & Drei)' },
    { name: 'Supabase', icon: <SupabaseIcon />, description: 'Backend & Real-time' },
    { name: 'Tailwind CSS', icon: <TailwindIcon />, description: 'Styling' },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800/80 border border-gray-700 text-white rounded-lg shadow-2xl max-w-4xl w-full mx-auto relative max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center flex-shrink-0">
            <h2 className="text-4xl font-bold">What is "Tara, Labas Tayo?"</h2>
            <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            >
                <CloseIcon className="w-8 h-8" />
            </button>
        </div>
        
        <div className="p-8 overflow-y-auto custom-scrollbar flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-2">
              <Section title="The Inspiration">
                  <p>
                      "Tara, Labas Tayo?" ("Come on, let's go out?") is common Filipino word used in inviting people out. This project was born from the idea of creating a digital hangout spot that captures that same spirit of community and friendship.
                  </p>
                  <p>
                      It's a web-based, 3D social space where users can meet up, chat in real-time, and simply spend time together, whether they're across the street or across the world.
                  </p>
              </Section>

              <Section title="About Me">
                  <p>
                      I am a currently an aspiring developer with a passion for building applications and games. My focus is on creating full-stack projects with backend integration, and I am driven to build greater applications that serve a meaningful purpose beyond games.
                  </p>
              </Section>
              <Section title="About this project">
                  <p>
                      This project is a comprehensive showcase of my full-stack development capabilities. Using an industry-standard tech stack, it demonstrates my ability to build a complete, interactive application featuring real-time player synchronization, a persistent backend, and live chat functionality. 
                  </p>
              </Section>
            </div>

            <div>
              <Section title="The Technology">
                  <div className="space-y-6">
                    {techStack.map(tech => (
                      <div key={tech.name} className="flex items-center space-x-4">
                        <div className="w-10 h-10 text-gray-400 flex-shrink-0">
                          {tech.icon}
                        </div>
                        <div>
                          <p className="font-bold text-lg text-white">{tech.name}</p>
                          <p className="text-sm text-gray-400">{tech.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
              </Section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

