"use client"

import { useState } from "react"

interface IAnimatedOptionsSection {
    children: React.ReactNode
}

export default function AnimatedOptionsSection({children} : IAnimatedOptionsSection) {

    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className={!isOpen ? "cursor-pointer w-fit" : ""}>
            {!isOpen && 
                <div className="bg-amber-400 w-30 h-96 flex items-center justify-center">
                    <div className="-rotate-90 flex gap-4">
                        <span className="text-center flex w-30">Mostrar opções</span>
                        <span className="material-symbols-outlined text-center">arrow_forward_ios</span>
                    </div>
                </div>
            }
            {isOpen && children}
        </div>
    )
}
