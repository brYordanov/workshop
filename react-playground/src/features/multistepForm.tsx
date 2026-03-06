import React, { useState } from 'react';
import { useForm } from '../helpers/useForm';

type FormData = {
  name: string;
  email: string;
  plan: string;
  cardNumber: string;
};

const InitialData: FormData = {
  name: '',
  email: '',
  plan: '',
  cardNumber: '',
};

const validators = {
  name: (value: unknown) => {
    if (typeof value !== 'string') return 'Invalid value';
    if (!value.trim()) return 'Name is required';
    return null;
  },
  email: (value: unknown) => {
    if (typeof value !== 'string') return 'Invalid value';
    if (!value.includes('@')) return 'Invalid email';
    return null;
  },
  plan: (value: unknown) => {
    if (typeof value !== 'string') return 'Invalid value';
    if (!value.trim()) return 'Please enter a plan';
    return null;
  },
  cardNumber: (value: unknown) => {
    if (typeof value !== 'string') return 'Invalid value';
    const v = value.trim();
    if (!v) return 'Card number is required';
    if (!/^\d{6}$/.test(v)) return 'Card number must be 6 digits';
    return null;
  },
};

const steps = [PersonalInfo, PlanSection, Payment];

export function MultiStepForm() {
  const [step, setStep] = useState(1);
  const {
    data: formData,
    errors,
    update,
    handleSubmit,
    reset,
    handleBlur,
  } = useForm<FormData>(InitialData, validators);

  const onSubmit = (data: FormData) => {
    console.log(data);
    reset();
  };

  const StepComponent = steps[step - 1];

  return (
    <>
      <div>{step}</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormNav step={step} setStep={setStep} stepsCount={steps.length} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <StepComponent
            formData={formData}
            update={update}
            errors={errors}
            handleBlur={handleBlur}
          />
          ;
        </div>
      </form>
    </>
  );
}

function PersonalInfo({
  formData,
  update,
  errors,
  handleBlur,
}: {
  formData: FormData;
  errors: Record<keyof FormData, string | null>;
  update: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  handleBlur: (key: keyof FormData) => void;
}) {
  return (
    <>
      <h4>PersonalInfo</h4>
      <input
        placeholder="name"
        value={formData.name}
        onBlur={() => handleBlur('name')}
        onChange={(e) => update('name', e.target.value)}
      />
      {errors?.name && <p>{errors.name}</p>}
      <input
        placeholder="email"
        value={formData.email}
        onBlur={() => handleBlur('email')}
        onChange={(e) => update('email', e.target.value)}
      />
      {errors.email && <p>{errors.email}</p>}
    </>
  );
}

function PlanSection({
  formData,
  errors,
  update,
  handleBlur,
}: {
  formData: FormData;
  errors: Record<keyof FormData, string | null>;
  update: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  handleBlur: (key: keyof FormData) => void;
}) {
  return (
    <>
      <h4>Plan</h4>
      <input
        placeholder="plan"
        value={formData.plan}
        onBlur={() => handleBlur('plan')}
        onChange={(e) => update('plan', e.target.value)}
      />
      {errors?.plan && <p>{errors.plan}</p>}
    </>
  );
}

function Payment({
  formData,
  errors,
  update,
  handleBlur,
}: {
  formData: FormData;
  errors: Record<keyof FormData, string | null>;
  update: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  handleBlur: (key: keyof FormData) => void;
}) {
  return (
    <>
      <h4>Payment</h4>
      <input
        placeholder="card number"
        value={formData.cardNumber}
        onBlur={() => handleBlur('cardNumber')}
        onChange={(e) => update('cardNumber', e.target.value)}
      />
      {errors?.cardNumber && <p>{errors.cardNumber}</p>}
    </>
  );
}

function FormNav({
  step,
  setStep,
  stepsCount,
}: {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  stepsCount: number;
}) {
  return (
    <nav style={{ paddingBottom: '10px' }}>
      <button
        type="button"
        onClick={() => setStep((prev) => prev - 1)}
        disabled={step === 1}
      >
        Prev
      </button>
      <button type="submit">Submit</button>
      <button
        type="button"
        onClick={() => setStep((prev) => prev + 1)}
        disabled={step >= stepsCount}
      >
        Next
      </button>
    </nav>
  );
}
