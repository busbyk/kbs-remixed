import { useIsSubmitting } from 'remix-validated-form';
import classnames from 'classnames';

type SubmitButtonProps = {
  label: string;
  labelSubmitting: string;
  className?: string;
  name?: string;
  value?: string;
};

export default function SubmitButton({
  label,
  labelSubmitting,
  className,
  name,
  value,
}: SubmitButtonProps) {
  const isSubmitting = useIsSubmitting();

  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className={classnames(className)}
      name={name}
      value={value}
    >
      {isSubmitting ? labelSubmitting : label}
    </button>
  );
}
