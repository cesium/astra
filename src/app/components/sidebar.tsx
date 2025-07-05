'use client'

import Link from 'next/link';
import { useState, createContext, useContext } from 'react';

interface ParentProps {
  children: React.ReactNode
  className?: string
}

interface SideBarProps extends ParentProps {
  defaultSelected?: string;
}

interface SideBarContextType {
  selected: string | null;
  setSelected: React.Dispatch<React.SetStateAction<string | null>>;
}

interface ItemProps extends ParentProps {
  id: string
  href: string
} 

// Compound Components

const SideBarContext = createContext<SideBarContextType | null>(null);


export function SibebarHeader({children, className}: ParentProps) {
  return (
    <div className={`pt-5 pb-3 mx-3 mb-2.5 border-b border-gray-200 text-[#00000080] ${className}`}>
      {children}
    </div>
  )
}

export function SidebarItemList({children, className}: ParentProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {children}
    </div>
  )
}

export function SidebarItem({children, className, id, href}: ItemProps) {
    const context = useContext(SideBarContext);
    
    if (!context) {
      throw new Error('Item must be used within a Sidebar');
    }
    
    const {selected, setSelected} = context;

    const isSelected = selected === id

  return (
    <Link
      href={href} 
      onClick={() => setSelected(id)}
      className={`inline-flex gap-2 items-center group py-2.5 px-3 text-[#00000080] rounded-lg transition-all duration-300 ease-in-out cursor-pointer ${isSelected ? "ring-1 ring-[#ee784971] bg-[#EE77491A] text-[#EE7749]" : "hover:bg-gray-100"} ${className}`}>
      {children}
    </Link>
  )
}


// Main Sidebar component
export default function Sidebar({children, defaultSelected}: SideBarProps) {
    const [selected, setSelected] = useState<string | null>(defaultSelected || null);

  return (
    <div className='h-full py-2 px-0.5'>
      <SideBarContext.Provider value={{selected, setSelected}}>
          {children}
      </SideBarContext.Provider>
    </div>
  )
}

