// Import statements remain unchanged
import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { TeamMember } from '@/app/utils/type';
import { alertError } from '@/app/utils/alerts';
import { ROLE_REGULAR, ROLE_ADMIN } from '@/app/utils/constant';
import IMask from 'imask';

const roleOptions = [
  { value: ROLE_REGULAR, label: "Regular - Can't delete members" },
  { value: ROLE_ADMIN, label: 'Admin - Can delete members' },
];

interface TeamMemberFormProps {
  member?: TeamMember | null;
  onToggleView: (e?: React.SyntheticEvent) => void;
}

const TeamMemberForm: React.FC<TeamMemberFormProps> = ({
  member,
  onToggleView,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    clearErrors,
  } = useForm<TeamMember>();
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const selectedRole = watch('role');
  const phoneValue = watch('phone');

  const inputPhoneRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (member) {
      // Prefill the form with the member details if member exists
      reset({
        first_name: member.first_name,
        last_name: member.last_name,
        phone: member.phone,
        email: member.email,
        role: member.role,
      });
    } else {
      // Optionally reset the form to default values if adding a new member
      reset({
        first_name: '',
        last_name: '',
        phone: '',
        email: '',
        role: ROLE_REGULAR,
      });
    }
  }, [member, reset]);

  useEffect(() => {
    register('phone', {
      required: 'Phone number is required',
      pattern: {
        value: /^\(\d{3}\) \d{3}-\d{4}$/,
        message:
          'Invalid phone number format, correct format is: (xxx) xxx-xxxx',
      },
    });
    const maskOptions = { mask: '(000) 000-0000' };

    if (inputPhoneRef.current) {
      const mask = IMask(inputPhoneRef.current, maskOptions);
      mask.on('accept', () => {
        setValue('phone', mask.value);
        clearErrors('phone');
      });
      return () => mask.destroy();
    }
  }, [register, setValue, clearErrors]);

  const onSubmit = async (data: TeamMember) => {
    try {
      const url =
        process.env.NEXT_PUBLIC_API_HOST +
        (member ? `/team/members/${member.id}` : '/team/members');

      const response = await fetch(url, {
        method: member ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok && response.status !== 400) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: {
        success: number;
        data?: TeamMember;
        errors?: Record<string, string[]>;
      } = await response.json();

      if (result.success) {
        onToggleView();
      } else {
        if (result.errors) {
          const errorMessages = Object.values(result.errors).flat();
          setFormErrors(errorMessages);
        } else {
          alertError(`Cannot add new team member. Please try again!`);
        }
      }
    } catch (error) {
      console.log(error);
      alertError('An error occurred while submitting the form');
    }
  };

  const deleteMember = async () => {
    const result = await Swal.fire({
      title: 'Delete Team Member?',
      text: 'Are you sure you want to delete this team member?',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      confirmButtonColor: 'rgb(59 130 246)',
    });

    if (result.isConfirmed && member) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_HOST}/team/members/${member.id}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        if (response.status === 204) {
          onToggleView();
        } else {
          alertError(`Cannot add new team member. Please try again!`);
        }
      } catch (error) {
        console.log(error);
        alertError('An error occurred while deleting the member');
      }
    }
  };

  return (
    <div>
      <div className="mb-4 text-right">
        <Link
          href="#"
          onClick={onToggleView}
          className="text-gray-400 hover:text-blue-600"
        >
          Back to List
        </Link>
      </div>
      <h2 className="mb-1 text-2xl font-bold">
        {member ? 'Edit' : 'Add a'} Team Member
      </h2>
      <p className="border-color-gray-75 mb-4 border-b border-solid pb-4 text-sm text-slate-400">
        Set contact info and role
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Form fields */}
        <div className="flex flex-col">
          <input
            {...register('first_name', { required: 'First name is required' })}
            placeholder="First Name"
            className={`input ${errors.first_name ? 'error' : 'normal'}`}
          />
          {errors.first_name && (
            <p className="text-sm text-red-500">{errors.first_name.message}</p>
          )}
        </div>

        <div className="flex flex-col">
          <input
            {...register('last_name', { required: 'Last name is required' })}
            placeholder="Last Name"
            className={`input ${errors.last_name ? 'error' : 'normal'}`}
          />
          {errors.last_name && (
            <p className="text-sm text-red-500">{errors.last_name.message}</p>
          )}
        </div>

        <div className="flex flex-col">
          <input
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format' },
            })}
            placeholder="Email"
            className={`input ${errors.email ? 'error' : 'normal'}`}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col">
          <input
            placeholder="Phone"
            ref={inputPhoneRef}
            className={`input ${errors.phone ? 'error' : 'normal'}`}
            defaultValue={phoneValue}
            onInput={() => {
              if (inputPhoneRef.current) {
                setValue('phone', inputPhoneRef.current.value);
              }
            }}
          />
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone.message}</p>
          )}
        </div>

        <h2 className="mb-1 pt-4 text-xl font-bold">Role</h2>
        {roleOptions.map((option) => (
          <div
            key={option.value}
            className="border-b border-solid border-gray-200 pb-4"
          >
            <label
              htmlFor={option.value}
              className={`flex items-center justify-between ${
                selectedRole === option.value
                  ? 'text-gray-700'
                  : 'text-gray-400'
              } hover:text-blue-600`}
            >
              <span>{option.label}</span>
              <input
                {...register('role')}
                type="radio"
                value={option.value}
                id={option.value}
                className="form-radio inline-block h-5 w-5 text-blue-600"
              />
            </label>
          </div>
        ))}

        {formErrors.length > 0 && (
          <div className="mt-2 rounded-md border border-solid border-red-500 bg-red-100 p-2 text-sm text-red-500">
            {formErrors.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        )}

        <div className="flex justify-between pt-4">
          {member ? (
            <button
              type="button"
              onClick={deleteMember}
              className="rounded border border-red-300 px-4 py-2 font-bold text-red-500 hover:bg-red-100"
            >
              Delete
            </button>
          ) : (
            <div></div>
          )}
          <input
            type="submit"
            value="Save"
            className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          />
        </div>
      </form>
    </div>
  );
};

export default TeamMemberForm;
