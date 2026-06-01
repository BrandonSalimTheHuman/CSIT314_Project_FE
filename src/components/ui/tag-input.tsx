'use client';

import * as React from 'react';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';

interface TagInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  'aria-invalid'?: boolean;
}

export function TagInput({
  value,
  onChange,
  placeholder = 'Type and press Enter…',
  className,
  'aria-invalid': ariaInvalid,
}: TagInputProps) {
  const [inputValue, setInputValue] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  const addTag = (raw: string) => {
    const trimmed = raw.replace(/,+$/, '').trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInputValue('');
  };

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeTag(value.length - 1);
    }
  };

  return (
    <div
      className={cn(
        'flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50',
        ariaInvalid &&
          'border-destructive ring-3 ring-destructive/20 dark:ring-destructive/40',
        className,
      )}
      onClick={() => inputRef.current?.focus()}
    >
      {value.map((tag, index) => (
        <span
          key={index}
          className='inline-flex h-6 items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground'
        >
          {tag}
          <button
            type='button'
            onClick={(e) => {
              e.stopPropagation();
              removeTag(index);
            }}
            className='ml-0.5 rounded-full outline-none hover:bg-white/20 focus-visible:ring-1'
            aria-label={`Remove ${tag}`}
          >
            <X className='size-3' />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          if (inputValue.trim()) addTag(inputValue);
        }}
        placeholder={value.length === 0 ? placeholder : ''}
        className='min-w-20 flex-1 bg-transparent outline-none placeholder:text-muted-foreground'
      />
    </div>
  );
}
