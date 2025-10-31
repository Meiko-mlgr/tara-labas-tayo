# Tara, Labas Tayo? (Come on, let's go out?)

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://tara-labas.netlify.app)

[![K0HIJhF.md.png](https://iili.io/K0HIJhF.md.png)](https://freeimage.host/i/K0HIJhF)

[![K0HIHI1.md.png](https://iili.io/K0HIHI1.md.png)](https://freeimage.host/i/K0HIHI1)

[![KsH2172.md.png](https://iili.io/KsH2172.md.png)](https://freeimage.host/i/KsH2172)

_"Tara, Labas Tayo?"_ is a Filipino phrase that translates to "Come on, let's go out?". This project is a web-based, 3D social space where users can create characters, hang out, and chat in real-time. It's a digital hangout spot that captures the spirit of community and friendship.

## About The Project

This project is a comprehensive showcase of my full-stack development capabilities. It's an interactive 3D application featuring real-time player synchronization, a persistent backend for user data, and live chat functionality. The primary goal is to demonstrate the ability to build a complete, modern web application using an industry-standard tech stack.

## Tech Stack

* **Framework:** [Next.js](https://nextjs.org/) (with TypeScript)
* **3D Graphics:** [Three.js](https://threejs.org/) (with [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction) and [Drei](https://github.com/pmndrs/drei))
* **Physics:** [Rapier](https://rapier.rs/) (via [@react-three/rapier](https://github.com/pmndrs/react-three-rapier))
* **Backend & Database:** [Supabase](https://supabase.io/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Version Control:** [Git](https://git-scm.com/) & [Github](https://github.com)

## Features

* **Real-time Multiplayer:** Synchronized player movements and interactions in a shared 3D space.
* **User Authentication:** Secured user sign-up and login functionality integrated and handled by Supabase.
* **Character Customization:** Users can create and customize their avatars with different colors.
* **Live Chat:** A real-time chat feature allows users to communicate with each other in the room.
* **Persistent Data:** User and character data are stored in a Supabase backend, allowing users to continue where they left off, and clear when no users are in the room.

## Getting Started

To get a local copy up and running follow these simple steps.

**Prerequisites**
* Node.js (v18 or higher recommended)
* npm, yarn, or pnpm

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Meiko-mlgr/tara-labas-tayo
    ```
2.  **Navigate to the project directory**
    ```bash
    cd tara-labas-tayo
    ```
3.  **Install NPM packages**
    ```bash
    npm install
    ```

**Set up Supabase**

- Go to [Supabase](https://supabase.io) and create a new project.
- In the Supabase dashboard, go to the SQL Editor.
- Create a new query and run the contents of the ```schema.sql``` file from this repository. This will create all the necessary tables and security policies.

**Set up Environment Variables**
- In the root of your project, create a new file named ```.env.local```.
- Go to your Supabase project settings (```Settings```>```API```) and find your Project URL and ```anon``` public key.

5. **Add these lines in your ```env.local``` file:**
  ```bash
  NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
  ```

6. **Run the development server**

  ```bash
  npm run dev
  ```

## Contact

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Mikko_Melgar-blue?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/mikko-melgar-447069233)
[![Email](https://img.shields.io/badge/Email-Contact%20Me-red?style=for-the-badge&logo=gmail)](mailto:springleaked@gmail.com)
