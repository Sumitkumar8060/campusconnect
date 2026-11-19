import React from 'react';

/**
 * Reusable text/email/id input component with accessible labels,
 * validation error messaging, and consistent focus rings.
 */
export default function AuthInput({
  id,
  name,
  type = 'text',
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  icon: Icon,
  required = false,
  autoComplete,
}) {
  return (
    <div className="w-full space-y-1.5">
      <label
        htmlFor={id}
        className="block text-xs font-semibold uppercase tracking-wider text-[#171717]"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative rounded-xl shadow-sm">
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#666666]">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`block w-full h-11 rounded-xl bg-white text-sm text-[#171717] placeholder:text-[#888888] border transition-all duration-200 outline-none ${
            Icon ? 'pl-10' : 'pl-3.5'
          } pr-3.5 ${
            error
              ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
              : 'border-[#D5D1C9] focus:border-[#171717] focus:ring-2 focus:ring-[#171717]/10'
          }`}
        />
      </div>

      {error && (
        <p id={`${id}-error`} className="text-xs text-red-600 font-medium">
          {error}
        </p>
      )}
    </div>
  );
}