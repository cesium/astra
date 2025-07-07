import Image from "next/image";
import React from "react";

interface IAvatarProps {
  src?: string;
  name?: string;
  className?: string;
}

function getInitials(name: string): string {
  const names = name.split(" ");
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }
  return (
    names[0].charAt(0).toUpperCase() +
    names[names.length - 1].charAt(0).toUpperCase()
  );
}

const Avatar = ({ src, name, className }: IAvatarProps) => {
  return (
    <figure className={`overflow-hidden rounded-full ${className || ""}`}>
      {src ? (
        <Image
          src={src}
          alt="User Avatar"
          width={34}
          height={34}
          className="object-cover"
        />
      ) : (
        <div className="flex size-full min-w-8 min-h-8 items-center justify-center bg-gradient-to-b from-black/20 to-black/40">
          <span className="text-white">{name && getInitials(name)}</span>
        </div>
      )}
    </figure>
  );
};

export default Avatar;
