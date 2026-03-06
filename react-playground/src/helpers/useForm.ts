import React, { useMemo, useState } from 'react';

type ValidationErr = string | null;

export function useForm<T extends Record<string, unknown>>(
  initialValues: T,
  validators?: Partial<{ [K in keyof T]: (value: T[K]) => ValidationErr }>
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

  const validateField = <K extends keyof T>(key: K, value: T[K]) => {
    const err = validators?.[key]?.(value) ?? null;
    setErrors((prev) => ({ ...prev, [key]: err }));
    return err;
  };

  const validateAll = () => {
    let isValid = true;
    (Object.entries(data) as [keyof T, T[keyof T]][]).forEach(([k, v]) => {
      const err = validateField(k, v);
      if (err) {
        isValid = false;
      }
    });

    return isValid;
  };

  const update = <K extends keyof T>(key: K, value: T[K]) => {
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
