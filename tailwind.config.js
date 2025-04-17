/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // extend: {
    //   colors: {
    //     primary: "#6366F1",   // Vibrant indigo
    //     base: "#1E293B",      // Slate base for backgrounds
    //     accent: "#10B981", 
    //     white :"#f5f5f5"  // Green for success/CTA
    //   },
    //   backgroundImage: {
    //     'gradient-slate': "linear-gradient(135deg, #0F172A, #1E293B)",
    //   },
    // }
    extend: {
      colors: {
        primary: '#1e293b', // Dark Slate Background Color
        secondary: '#1e293b80', // Semi-transparent Dark Slate (for background)
        accent: '#16a34a', // Green-400 for accents and text
        accentDark: '#064e3b', // Dark Green for hover and other accents
        accentText: '#10b981', // Green Text Color
        baseText: '#f9fafb', // White Text
        lightText: '#d1d5db', // Zinc-300 (light gray text)
        backdropBlur: 'rgba(0, 0, 0, 0.5)', // Backdrop Blur color
        slate900: '#1e293b', // Slate-900
        slate800: '#2d3748', // Slate-800
        slate700: '#4a5568', // Slate-700
        green800: '#2f855a', // Green-800 for borders and accents
        green500: '#48bb78', // Green-500 for hover states and borders
        green400: '#34d399', // Green-400 for accent text
      },
      
    },
    keyframes: {
      curve: {
        '0%, 100%': { transform: 'scale(1)' },
        '50%': { transform: 'scale(1.1) translateY(-1px)' },
      },
    },
    animation: {
      curve: 'curve 0.3s ease-in-out',
    },
    
    
    
  }
  ,
  plugins: [],
}
