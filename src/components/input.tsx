interface IInputProps {
  placeholder?: string;
  type: string;
  disabled?: boolean;
  className?: string;
  name?: string;
  value?: string;
  center_text?: boolean;
  min?: number;
  max?: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({ placeholder, type, disabled, className, name, value, center_text, min, max, onChange }: IInputProps) {
  
  const textAlignment = center_text ? 'text-center' : 'text-left';

  return (
    <input 
      type={type} 
      placeholder={placeholder}   
      disabled={disabled}
      name={name} 
      value={value}
      onChange={onChange}
      className={`${className} ${textAlignment} rounded-xl border border-black/10 outline-none text-black px-3 py-2.5 text-lg placeholder:text-black/30 invalid:border-red-500 invalid:text-red-600`}   
      {...(type === 'number' && min !== undefined && { min })}
      {...(type === 'number' && max !== undefined && { max })}
    />
  )
}