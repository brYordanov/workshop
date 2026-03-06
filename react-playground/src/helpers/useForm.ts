import React, { useMemo, useState } from 'react';

type ValidationErr = string | null;

export function useForm<T extends Record<string, unknown>>(
  initialValues: T,
  validators?: Partial<Record<keyof T, (value: unknown) => ValidationErr>>
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

  const [data, setData] = useState(initialValues);
  const [errors, setErrors] = useState(initialErrors);
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const validateField = (key: keyof T, value: unknown) => {
    const err = validators?.[key]?.(value) ?? null;
    setErrors((prev) => ({ ...prev, [key]: err }));
    return err;
  };

  const validateAll = () => {
    let isValid = true;
    Object.keys(initialValues).forEach((k) => {
      const err = validateField(k, data[k]);
      if (err) {
        isValid = false;
      }
    });

    return isValid;
  };

  const update = (key: keyof T, value: unknown) => {
    setData((prev) => ({ ...prev, [key]: value }));

    if (touched[key]) {
      validateField(key, value);
    }
  };

  const handleSubmit = (onSubmit: (data: T) => void) => {
    return (e: React.FormEvent) => {
      e.preventDefault();
      const isFormValid = validateAll();
      if (!isFormValid) return;
      onSubmit(data);
    };
  };

  const reset = () => {
    setData(initialValues);
    setErrors(initialErrors);
    setTouched({});
  };

  const handleBlur = (key: keyof T) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    validateField(key, data[key]);
  };

  return { data, errors, update, handleSubmit, reset, handleBlur };
}
