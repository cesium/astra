import clsx from 'clsx';
import React from 'react'
import { twMerge } from 'tailwind-merge';
import ActionButton from './action-button';

function ShiftTag({
  name,
  id,
  isEditing,
  state,
  onAdd,
  onRemove
}: {
  name: string;
  id: string;
  isEditing: boolean;
  state: "add" | "remove";
  onAdd: (id:string) => void,
  onRemove: (id:string) => void,
}) {
  return (
    <div
      className={twMerge(
        clsx(
          "bg-dark/5 inline-flex w-fit items-center gap-2.5 rounded-2xl py-1.5 select-none",
          isEditing ? "pr-1 pl-3" : "px-3",
        ),
      )}
    >
      <p>{name}</p>
      {isEditing && <ActionButton id={id} state={state} onAdd={onAdd} onRemove={onRemove}/>}
    </div>
  );
}

export default function EventHeader({
  name,
  color,
  shifts,
  isEditing,
  state,
  onAdd,
  onRemove
}: {
  name: string;
  color: string;
  shifts?: {
    id: string;
    type: string;
    number: number;
  }[];
  isEditing: boolean;
  state?: "add" | "remove";
  onAdd: (id:string) => void,
  onRemove: (id:string) => void,
}) {
  return (
    <div className={twMerge(clsx("flex flex-col pb-3", shifts && "gap-2"))}>
      <div className="inline-flex items-center pr-4">
        <div
          className="mr-2 h-3 w-1.5 rounded-full"
          style={{ backgroundColor: color }}
        />
        <p className="max-w-2xs flex-1 truncate">{name}</p>
        {!shifts && isEditing && <ActionButton state={state!} onAdd={onAdd} onRemove={onRemove} />}
      </div>
      <div className="flex w-fit flex-wrap gap-2 pr-2">
        {shifts &&
          shifts.map((shift) => (
            <ShiftTag
              key={shift.id}
              name={`${shift.type}${shift.number}`}
              id={shift.id}
              isEditing={isEditing}
              state={state!}
              onAdd={onAdd}
              onRemove={onRemove}
            />
          ))}
      </div>
    </div>
  );
}