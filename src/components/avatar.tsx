import clsx from "clsx";
import Image from "next/image";
import React from "react";
import { twMerge } from "tailwind-merge";

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
    <figure
      className={twMerge(
        clsx(
          "bg-light size-10 overflow-hidden rounded-full text-lg select-none",
          className,
        ),
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={name ? `${name}'s avatar` : "User Avatar"}
          width={60}
          height={60}
          className="object-cover"
        />
      ) : (
        <div className="[container-type:size] container flex size-full resize items-center justify-center bg-gradient-to-b from-black/20 to-black/40">
          <span className="text-light text-[40cqmin]">
            {name && getInitials(name)}
          </span>
        </div>
      )}
    </figure>
  );
};

export default Avatar;
