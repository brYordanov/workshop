import React, { useState } from 'react';

type ValidationErr = string | null;

export function useForm<T extends Record<string, string>>(
  initialValues: T,
  validators: (value: string) => ValidationErr
) {
  const [formValues, setFormValues] = useState(initialValues);
  const [errors, setErrors] = useState(() =>
    Object.keys(initialValues).reduce(
      (acc, curr) => {
        acc[curr as keyof T] = null;
        return acc;
      },
      {} as Record<keyof T, ValidationErr>
    )
  );

  const validateField = (key: keyof T, value: string) => {};

  const update = (key: keyof T, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (onSubmit: (data: T) => void) => {
    return (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formValues);
    };
  };

  return { formValues, handleSubmit, update };
}
