import React, { useMemo, useState } from 'react';

type ValidationErr = string | null;

export function useForm<T extends Record<string, string>>(
  initialValues: T,
  validators?: Record<keyof T, (value: string) => ValidationErr>
) {
  const initialErrors = useMemo(
    () =>
      Object.keys(initialValues).reduce(
        (acc, curr) => {
          acc[curr as keyof T] = null;
          return acc;
        },
        {} as Record<keyof T, ValidationErr>
      ),
    [initialValues]
  );
  const [formValues, setFormValues] = useState(initialValues);
  const [errors, setErrors] = useState(initialErrors);
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const validateField = (key: keyof T, value: string) => {
    const error = validators?.[key](value) ?? null;
    setErrors((prev) => ({ ...prev, [key]: error }));

    return error;
  };

  const validateAll = () => {
    let isValid = true;
    Object.entries(formValues).forEach(([k, v]) => {
      const err = validateField(k, v);
      if (err) {
        isValid = false;
      }
    });

    return isValid;
  };

  const update = (key: keyof T, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));

    if (touched[key]) {
      validateField(key, value);
    }
  };

  const handleSubmit = (onSubmit: (data: T) => void) => {
    return (e: React.FormEvent) => {
      e.preventDefault();
      const isFormValid = validateAll();
      if (!isFormValid) return;
      onSubmit(formValues);
    };
  };

  const reset = () => {
    setFormValues(initialValues);
    setErrors(initialErrors);
  };

  const handleBlur = (key: keyof T) => {
    setTouched((prev) => ({ ...prev, [key]: true }));

    validateField(key, formValues[key]);
  };

  return { formValues, errors, handleSubmit, update, reset, handleBlur };
}
