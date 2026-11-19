import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

/**
 * Reusable password input with show/hide password toggle,
 * accessible keyboard controls, and validation error messages.
 */
export default function PasswordInput({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  placeholder = '••••••••',
  error,
  required = false,
  autoComplete = 'current-password',
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full space-y-1.5">
      <label
        htmlFor={id}
        className="block text-xs font-semibold uppercase tracking-wider text-[#171717]"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative rounded-xl shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#666666]">
          <Lock className="h-4 w-4" />
        </div>

        <input
          id={id}
          name={name}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`block w-full h-11 rounded-xl bg-white text-sm text-[#171717] placeholder:text-[#888888] border transition-all duration-200 outline-none pl-10 pr-11 ${
            error
              ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
              : 'border-[#D5D1C9] focus:border-[#171717] focus:ring-2 focus:ring-[#171717]/10'
          }`}
        />

        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#666666] hover:text-[#171717] transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] rounded-r-xl"
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>

      {error && (
        <p id={`${id}-error`} className="text-xs text-red-600 font-medium">
          {error}
        </p>
      )}
    </div>
  );
}