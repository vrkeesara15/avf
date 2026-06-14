import { useState } from "react";
import type { Errors } from "./validation";

type Validate<T> = (values: T) => Errors<T>;

/**
 * Minimal form state + validation hook.
 * Validation runs on submit; field errors clear as the user edits.
 */
export function useForm<T extends Record<string, string | boolean>>(
  initial: T,
  validate: Validate<T>,
  onValid: (values: T) => void
) {
  const [values, setValues] = useState<T>(initial);
  const [errors, setErrors] = useState<Errors<T>>({});
  const [submitted, setSubmitted] = useState(false);

  const setField = <K extends keyof T>(name: K, value: T[K]) => {
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((e) => {
      if (!e[name]) return e;
      const next = { ...e };
      delete next[name];
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length === 0) {
      onValid(values);
      setSubmitted(true);
      setValues(initial);
    }
  };

  const reset = () => {
    setValues(initial);
    setErrors({});
    setSubmitted(false);
  };

  return { values, errors, submitted, setField, handleSubmit, reset };
}
