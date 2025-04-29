import { useState, useEffect } from 'react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { FormField, FormSection } from '@/types/form';
import { getForm } from '@/services/api';

interface DynamicFormProps {
  rollNumber: string;
}

interface FormData {
  [key: string]: string | string[] | boolean;
}

// Create a separate component for form fields to access form context
function FormFields({ fields }: { fields: FormField[] }) {
  const { register, formState: { errors } } = useFormContext();

  const renderField = (field: FormField) => {
    switch (field.type) {
      case 'text':
      case 'tel':
      case 'email':
        return (
          <input
            {...register(field.fieldId, {
              required: field.required && 'This field is required',
              minLength: field.minLength && {
                value: field.minLength,
                message: `Minimum length is ${field.minLength}`
              },
              maxLength: field.maxLength && {
                value: field.maxLength,
                message: `Maximum length is ${field.maxLength}`
              }
            })}
            type={field.type}
            placeholder={field.placeholder}
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            data-testid={field.dataTestId}
          />
        );

      case 'date':
        return (
          <input
            {...register(field.fieldId, {
              required: field.required && 'This field is required'
            })}
            type="date"
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            data-testid={field.dataTestId}
          />
        );

      case 'textarea':
        return (
          <textarea
            {...register(field.fieldId, {
              required: field.required && 'This field is required',
              minLength: field.minLength && {
                value: field.minLength,
                message: `Minimum length is ${field.minLength}`
              },
              maxLength: field.maxLength && {
                value: field.maxLength,
                message: `Maximum length is ${field.maxLength}`
              }
            })}
            placeholder={field.placeholder}
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            data-testid={field.dataTestId}
          />
        );

      case 'dropdown':
        return (
          <select
            {...register(field.fieldId, {
              required: field.required && 'This field is required'
            })}
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            data-testid={field.dataTestId}
          >
            <option value="">Select an option</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value} data-testid={option.dataTestId}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map(option => (
              <label key={option.value} className="flex items-center">
                <input
                  {...register(field.fieldId, {
                    required: field.required && 'This field is required'
                  })}
                  type="radio"
                  value={option.value}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  data-testid={option.dataTestId}
                />
                <span className="ml-2">{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map(option => (
              <label key={option.value} className="flex items-center">
                <input
                  {...register(field.fieldId, {
                    required: field.required && 'This field is required'
                  })}
                  type="checkbox"
                  value={option.value}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  data-testid={option.dataTestId}
                />
                <span className="ml-2">{option.label}</span>
              </label>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {fields.map(field => (
        <div key={field.fieldId} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {renderField(field)}
          {errors[field.fieldId] && (
            <p className="mt-1 text-sm text-red-600">
              {errors[field.fieldId]?.message as string}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export default function DynamicForm({ rollNumber }: DynamicFormProps) {
  const [formData, setFormData] = useState<FormSection[]>([]);
  const [currentSection, setCurrentSection] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const methods = useForm<FormData>();

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await getForm(rollNumber);
        setFormData(response.form.sections);
        setLoading(false);
      } catch (error) {
        console.error('Form fetch error:', error);
        setError('Failed to load form. Please try again.');
        setLoading(false);
      }
    };

    fetchForm();
  }, [rollNumber]);

  const validateSection = async (sectionIndex: number) => {
    const section = formData[sectionIndex];
    const fields = section.fields.map(field => field.fieldId);
    const result = await methods.trigger(fields);
    return result;
  };

  const handleNext = async () => {
    const isValid = await validateSection(currentSection);
    if (isValid && currentSection < formData.length - 1) {
      setCurrentSection(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
    }
  };

  const onSubmit = (data: FormData) => {
    console.log('Form Data:', data);
  };

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center p-8">{error}</div>;
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="max-w-2xl mx-auto p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">{formData[currentSection].title}</h2>
          <p className="text-gray-600">{formData[currentSection].description}</p>
        </div>

        <FormFields fields={formData[currentSection].fields} />

        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentSection === 0}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            Previous
          </button>
          
          {currentSection === formData.length - 1 ? (
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Submit
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Next
            </button>
          )}
        </div>
      </form>
    </FormProvider>
  );
} 