import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { FormField } from './FormField';
import { MapPinIcon } from '@heroicons/react/24/outline';

interface AddressFormProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  prefix?: string;
}

export const AddressForm: React.FC<AddressFormProps> = ({ 
  register, 
  errors, 
  prefix = '' 
}) => {
  const getFieldName = (field: string) => prefix ? `${prefix}.${field}` : field;
  const getFieldError = (field: string) => {
    if (prefix) {
      return errors[prefix]?.[field];
    }
    return errors[field];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <MapPinIcon className="w-5 h-5 text-emerald-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Address Information
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <FormField
            label="Street Address"
            name={getFieldName('street')}
            type="text"
            placeholder="123 Main Street"
            required
            register={register}
            error={getFieldError('street')}
          />
        </div>

        <FormField
          label="City"
          name={getFieldName('city')}
          type="text"
          placeholder="Harare"
          required
          register={register}
          error={getFieldError('city')}
        />

        <FormField
          label="State/Province"
          name={getFieldName('state')}
          type="text"
          placeholder="Harare"
          required
          register={register}
          error={getFieldError('state')}
        />

        <FormField
          label="Postal Code"
          name={getFieldName('postalCode')}
          type="text"
          placeholder="0000"
          required
          register={register}
          error={getFieldError('postalCode')}
        />

        <FormField
          label="Country"
          name={getFieldName('country')}
          type="text"
          placeholder="Zimbabwe"
          required
          register={register}
          error={getFieldError('country')}
        />
      </div>
    </div>
  );
};
