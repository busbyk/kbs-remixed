import { useField } from 'remix-validated-form';
import classnames from 'classnames';
import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import { IoEyeSharp, IoEyeOffSharp } from 'react-icons/io5';

type InputProps = {
  name: string;
  label: string | null;
  type: string;
  className?: string;
  autocomplete?: string;
  defaultValue?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  value?: string;
};

export default function Input({
  name,
  label,
  type,
  className,
  autocomplete,
  defaultValue,
  onChange,
  value,
}: InputProps) {
  const { error, getInputProps } = useField(name);

  const [inputType, setInputType] = useState<string>(type);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  useEffect(() => {
    if (type === 'password') {
      setInputType(showPassword ? 'text' : 'password');
    }
  }, [showPassword, type]);

  return (
    <label
      htmlFor={name}
      className={classnames('w-full sm:w-[384px] px-px', className)}
    >
      <p className="uppercase text-xs font-semibold tracking-wider text-gray-500 mb-1">
        {label}
      </p>
      <div className="relative">
        {type === 'password' && (
          <div className="absolute top-0 bottom-0 right-4 flex justify-center items-center">
            <button
              className="my-auto"
              type="button"
              role="switch"
              aria-checked={showPassword}
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
            >
              {showPassword ? (
                <IoEyeSharp className="text-xl text-gray-600" />
              ) : (
                <IoEyeOffSharp className="text-xl text-gray-600" />
              )}
            </button>
          </div>
        )}
        <input
          type={inputType}
          {...getInputProps({ id: name })}
          className={classnames(
            `rounded-xl w-full py-3 pl-5 ${
              type === 'password' ? 'pr-12' : 'pr-5'
            } border-gray-500`,
            type === 'file' && 'border cursor-pointer hover:bg-gray-50'
          )}
          autoComplete={autocomplete}
          defaultValue={defaultValue || undefined}
          onChange={onChange}
          value={value}
        />
      </div>
      {!error && <p className="h-7"></p>}
      {error && (
        <p className="text-sm text-red-500 my-1 whitespace-wrap">{error}</p>
      )}
    </label>
  );
}
