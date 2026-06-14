import type { ReactNode } from "react";

interface BaseProps {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
}

function Wrap({
  id,
  label,
  error,
  required,
  hint,
  children,
}: BaseProps & { children: ReactNode }) {
  return (
    <div className="field">
      <label htmlFor={id}>
        {label} {required && <span className="req" aria-hidden="true">*</span>}
      </label>
      {children}
      {hint && !error && (
        <div className="form-note" id={`${id}-hint`}>
          {hint}
        </div>
      )}
      {error && (
        <div className="field-error" id={`${id}-error`} role="alert">
          {error}
        </div>
      )}
    </div>
  );
}

interface InputProps extends BaseProps {
  type?: string;
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;
}

export function TextField({
  type = "text",
  value,
  placeholder,
  onChange,
  ...base
}: InputProps) {
  return (
    <Wrap {...base}>
      <input
        id={base.id}
        type={type}
        className={`input${base.error ? " input--error" : ""}`}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!base.error}
        aria-describedby={
          base.error
            ? `${base.id}-error`
            : base.hint
              ? `${base.id}-hint`
              : undefined
        }
      />
    </Wrap>
  );
}

interface SelectProps extends BaseProps {
  value: string;
  options: string[];
  onChange: (v: string) => void;
}

export function SelectField({
  value,
  options,
  onChange,
  ...base
}: SelectProps) {
  return (
    <Wrap {...base}>
      <select
        id={base.id}
        className={`select${base.error ? " select--error" : ""}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!base.error}
        aria-describedby={base.error ? `${base.id}-error` : undefined}
      >
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </Wrap>
  );
}

interface AreaProps extends BaseProps {
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;
}

export function TextAreaField({
  value,
  placeholder,
  onChange,
  ...base
}: AreaProps) {
  return (
    <Wrap {...base}>
      <textarea
        id={base.id}
        className={`textarea${base.error ? " textarea--error" : ""}`}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!base.error}
        aria-describedby={base.error ? `${base.id}-error` : undefined}
      />
    </Wrap>
  );
}
