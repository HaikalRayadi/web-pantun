"use client";

import { Cpu } from "lucide-react";
import StaggeredMenu from "./StaggeredMenu";

interface NavbarProps {
  activeView: "home" | "chatbot";
  setActiveView: (view: "home" | "chatbot") => void;
  onNavigateToSection: (sectionId: string) => void;
}

export default function Navbar({ activeView, setActiveView, onNavigateToSection }: NavbarProps) {
  const handleNavClick = (sectionId: string) => {
    if (activeView !== "home") {
      // Transition back to home first, then scroll
      setActiveView("home");
      setTimeout(() => {
        onNavigateToSection(sectionId);
      }, 800); // Wait for transition out of chatbot to finish
    } else {
      onNavigateToSection(sectionId);
    }
  };

  const menuItems = [
    { 
      label: 'Home', 
      ariaLabel: 'Kembali ke Beranda', 
      link: '#hero', 
      onClick: () => handleNavClick("hero") 
    },
    { 
      label: 'About US', 
      ariaLabel: 'Pelajari tentang kami', 
      link: '#about', 
      onClick: () => handleNavClick("about") 
    },
    { 
      label: 'Tim Kami', 
      ariaLabel: 'Lihat tim kami', 
      link: '#team', 
      onClick: () => handleNavClick("team") 
    },
    { 
      label: activeView !== "chatbot" ? 'Mulai Chat' : 'Kembali', 
      ariaLabel: activeView !== "chatbot" ? 'Mulai membuat pantun' : 'Kembali ke halaman utama', 
      link: '#', 
      onClick: () => {
        if (activeView !== "chatbot") {
          setActiveView("chatbot");
        } else {
          setActiveView("home");
        }
      }
    }
  ];

  const socialItems = [
    { label: 'Twitter', link: 'https://twitter.com' },
    { label: 'GitHub', link: 'https://github.com' },
    { label: 'LinkedIn', link: 'https://linkedin.com' }
  ];

  const logoNode = (
    <div
      className="flex items-center gap-2 cursor-pointer group"
      onClick={() => setActiveView("home")}
      data-cursor="pointer"
    >
      <div className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 bg-zinc-950 transition-colors group-hover:border-white">
        <Cpu className="h-4 w-4 text-white transition-transform group-hover:rotate-45" />
        <div className="absolute -inset-0.5 rounded-lg bg-white/20 blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <span className="font-sans text-xs font-bold tracking-[0.25em] text-white uppercase">
        Generate <span className="text-zinc-400 font-light">Pantun</span>
      </span>
    </div>
  );

  return (
    <StaggeredMenu
      position="right"
      items={menuItems}
      socialItems={socialItems}
      displaySocials
      displayItemNumbering={true}
      menuButtonColor="#ffffff"
      openMenuButtonColor="#000000"
      changeMenuColorOnOpen={true}
      colors={['#343a40', '#212529']}
      logoUrl={logoNode}
      accentColor="#495057"
      isFixed={true}
      onMenuOpen={() => console.log('Menu opened')}
      onMenuClose={() => console.log('Menu closed')}
    />
  );
}
