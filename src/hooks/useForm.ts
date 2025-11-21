import { useCallback, useMemo, useState, ChangeEvent, FormEvent } from 'react';

type Validator<TValues> = (value: TValues[keyof TValues], values: TValues) => string | null;

type FieldConfig<TValues> = {
  required?: boolean;
  validate?: Validator<TValues>;
};

type FieldConfigs<TValues> = {
  [K in keyof TValues]?: FieldConfig<TValues>;
};

type Errors<TValues> = Partial<Record<keyof TValues, string>>;

interface UseFormOptions<TValues> {
  initialValues: TValues;
  fields?: FieldConfigs<TValues>;
  onSubmit: (values: TValues) => Promise<void> | void;
}

interface RegisteredFieldProps {
  id: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBlur: () => void;
}

export const useForm = <TValues extends Record<string, any>>({
  initialValues,
  fields = {},
  onSubmit,
}: UseFormOptions<TValues>) => {
  const [values, setValues] = useState<TValues>(initialValues);
  const [errors, setErrors] = useState<Errors<TValues>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof TValues, boolean>>>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getFieldConfig = useCallback((name: keyof TValues): FieldConfig<TValues> => fields[name] || {}, [fields]);

  const validateField = useCallback(
    (name: keyof TValues, value: TValues[keyof TValues], nextValues: TValues): string | null => {
      const config = getFieldConfig(name);

      // required
      if (config.required) {
        const str = String(value ?? '').trim();
        if (!str) {
          return 'fieldRequired';
        }
      }

      if (config.validate) {
        return config.validate(value, nextValues);
      }

      return null;
    },
    [getFieldConfig]
  );

  const validateAll = useCallback(
    (nextValues: TValues): Errors<TValues> => {
      const nextErrors: Errors<TValues> = {};

      (Object.keys(nextValues) as (keyof TValues)[]).forEach((name) => {
        const err = validateField(name, nextValues[name], nextValues);
        if (err) {
          nextErrors[name] = err;
        }
      });

      return nextErrors;
    },
    [validateField]
  );

  const handleChangeValue = useCallback(
    (name: keyof TValues, value: any) => {
      setValues((prev) => {
        const next = { ...prev, [name]: value };

        if (hasSubmitted || touched[name]) {
          const err = validateField(name, value, next);
          setErrors((prevErrors) => {
            const updated = { ...prevErrors };
            if (err) {
              updated[name] = err;
            } else {
              delete updated[name];
            }
            return updated;
          });
        }

        return next;
      });
    },
    [hasSubmitted, touched, validateField]
  );

  const handleChange = (name: keyof TValues) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    handleChangeValue(name, e.target.value);
  };

  const handleBlur = (name: keyof TValues) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit =
    (onSubmitEvent?: (e: FormEvent<HTMLFormElement>) => void) => async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (onSubmitEvent) {
        onSubmitEvent(e);
      }

      setHasSubmitted(true);

      const nextErrors = validateAll(values);
      setErrors(nextErrors);

      if (Object.keys(nextErrors).length > 0) {
        return;
      }

      try {
        setIsSubmitting(true);
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    };

  const register = (name: keyof TValues): RegisteredFieldProps => ({
    id: String(name),
    name: String(name),
    value: String(values[name] ?? ''),
    onChange: handleChange(name),
    onBlur: () => handleBlur(name),
  });

  const setFieldValue = (name: keyof TValues, value: any) => {
    handleChangeValue(name, value);
  };

  const requiredFields = useMemo(
    () => (Object.keys(fields) as (keyof TValues)[]).filter((key) => fields[key]?.required),
    [fields]
  );

  const hasEmptyRequired = requiredFields.some((name) => {
    const v = values[name];
    return String(v ?? '').trim() === '';
  });

  const isValid = Object.keys(errors).length === 0 && !hasEmptyRequired;

  const canSubmit = isValid && !isSubmitting;

  return {
    values,
    errors,
    touched,
    isSubmitting,
    hasSubmitted,
    isValid,
    canSubmit,
    register,
    handleSubmit,
    setFieldValue,
  };
};
