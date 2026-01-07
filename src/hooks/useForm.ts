import { useCallback, useMemo, useState, ChangeEvent, FormEvent } from 'react';

/**
 * Custom validator function for a field.
 * Returns error key string or null if valid.
 */
type Validator<TValues> = (value: TValues[keyof TValues], values: TValues) => string | null;

/**
 * Configuration for an individual field.
 * @example { required: true, validate: (value) => value.length < 6 ? 'tooShort' : null }
 */
type FieldConfig<TValues> = {
  required?: boolean;
  validate?: Validator<TValues>;
};

/** Map of field configurations */
type FieldConfigs<TValues> = {
  [K in keyof TValues]?: FieldConfig<TValues>;
};

/** Map of field errors (key = field name, value = translation key) */
type Errors<TValues> = Partial<Record<keyof TValues, string>>;

/** Options for the useForm hook */
interface UseFormOptions<TValues> {
  /** Initial form values */
  initialValues: TValues;
  /** Validation configuration for fields (optional) */
  fields?: FieldConfigs<TValues>;
  /** Function called on submit (after validation passes) */
  onSubmit: (values: TValues) => Promise<void> | void;
}

/**
 * Props returned by register() to be spread on an input.
 * @example <CustomInput {...register('firstName')} />
 */
interface RegisteredFieldProps {
  id: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBlur: () => void;
}

/**
 * Custom hook for form state management.
 *
 * @example
 * ```tsx
 * const { values, errors, register, handleSubmit, setFieldValue } = useForm({
 *   initialValues: { email: '', password: '' },
 *   fields: {
 *     email: { required: true },
 *     password: { required: true, validate: (val) => val.length < 6 ? 'tooShort' : null }
 *   },
 *   onSubmit: async (values) => await api.login(values)
 * });
 *
 * // In JSX:
 * <form onSubmit={handleSubmit()}>
 *   <input {...register('email')} />
 *   <input {...register('password')} />
 *   <button type="submit">Submit</button>
 * </form>
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useForm = <TValues extends Record<string, any>>({
  initialValues,
  fields = {},
  onSubmit,
}: UseFormOptions<TValues>) => {
  // State
  const [values, setValues] = useState<TValues>(initialValues);
  const [errors, setErrors] = useState<Errors<TValues>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof TValues, boolean>>>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get field configuration
  const getFieldConfig = useCallback((name: keyof TValues): FieldConfig<TValues> => fields[name] || {}, [fields]);

  // Validate a single field, returns error key or null
  const validateField = useCallback(
    (name: keyof TValues, value: TValues[keyof TValues], allValues: TValues): string | null => {
      const config = getFieldConfig(name);

      // Check required
      if (config.required) {
        const str = String(value ?? '').trim();
        if (!str) return 'fieldRequired';
      }

      // Check custom validation
      if (config.validate) {
        return config.validate(value, allValues);
      }

      return null;
    },
    [getFieldConfig]
  );

  // Validate all fields, returns error map
  const validateAll = useCallback(
    (vals: TValues): Errors<TValues> => {
      const newErrors: Errors<TValues> = {};

      (Object.keys(vals) as (keyof TValues)[]).forEach((name) => {
        const err = validateField(name, vals[name], vals);
        if (err) newErrors[name] = err;
      });

      return newErrors;
    },
    [validateField]
  );

  /**
   * Update a field value.
   * Re-validates automatically if form was submitted or field was touched.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setFieldValue = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (name: keyof TValues, value: any) => {
      setValues((prev) => {
        const next = { ...prev, [name]: value };

        // Re-validate if needed
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

  // Handler for standard input onChange
  const handleChange = (name: keyof TValues) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFieldValue(name, e.target.value);
  };

  // Handler for onBlur - marks field as touched
  const handleBlur = (name: keyof TValues) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  /**
   * Returns the form submit handler.
   * @example <form onSubmit={handleSubmit()}>
   */
  const handleSubmit =
    (onSubmitEvent?: (e: FormEvent<HTMLFormElement>) => void) => async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      onSubmitEvent?.(e);

      setHasSubmitted(true);

      // Validate all fields
      const newErrors = validateAll(values);
      setErrors(newErrors);

      // If errors exist, don't continue
      if (Object.keys(newErrors).length > 0) return;

      // Submit
      try {
        setIsSubmitting(true);
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    };

  /**
   * Register a field to bind it to the form.
   * Use spread on input: {...register('fieldName')}
   *
   * Note: Only works with inputs that use onChange(event).
   * For CustomSelect/CustomDatePicker, use setFieldValue directly.
   */
  const register = (name: keyof TValues): RegisteredFieldProps => ({
    id: String(name),
    name: String(name),
    value: String(values[name] ?? ''),
    onChange: handleChange(name),
    onBlur: () => handleBlur(name),
  });

  // Computed values
  const requiredFields = useMemo(
    () => (Object.keys(fields) as (keyof TValues)[]).filter((key) => fields[key]?.required),
    [fields]
  );

  const hasEmptyRequired = requiredFields.some((name) => {
    const v = values[name];
    return String(v ?? '').trim() === '';
  });

  const isValid = Object.keys(errors).length === 0 && !hasEmptyRequired;

  const normalize = (v: unknown) => (v === undefined || v === null ? '' : v);

  const isDirty = useMemo(() => {
    return (Object.keys(initialValues) as (keyof TValues)[]).some((key) => {
      return normalize(values[key]) !== normalize(initialValues[key]);
    });
  }, [values, initialValues]);

  const canSubmit = isValid && !isSubmitting;

  return {
    // State
    values,
    errors,
    touched,
    isSubmitting,
    hasSubmitted,

    // Computed
    isValid,
    isDirty,
    canSubmit,

    // Actions
    register,
    handleSubmit,
    setFieldValue,
    setValues,
    setErrors,
  };
};
