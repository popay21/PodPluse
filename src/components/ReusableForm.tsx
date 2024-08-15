import React from 'react';

interface Field {
  name: string;
  type: string;
  label: string;
}

interface ReusableFormProps {
  fields: Field[];
  onSubmit: (formData: Record<string, string>) => void;
  submitButtonText: string;
  buttonClasses?: string;
  inputClasses?: string;
}

const ReusableForm: React.FC<ReusableFormProps> = ({ 
  fields, 
  onSubmit, 
  submitButtonText, 
  buttonClasses,
  inputClasses
}) => {

  // פונקציה לטיפול בהגשת הטופס
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData: Record<string, string> = {}; // יצירת אובייקט לאחסון נתוני הטופס
    fields.forEach(field => {
      const input = e.currentTarget.elements.namedItem(field.name) as HTMLInputElement;
      formData[field.name] = input.value; // שמירת ערכי השדות באובייקט formData
    });
    onSubmit(formData); // קריאה לפונקציית onSubmit עם הנתונים מהטופס
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* יצירת שדות הטופס לפי ההגדרות במערך fields */}
      {fields.map((field) => (
        <div key={field.name}>
          <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
            {field.label}
          </label>
          <input
            type={field.type}
            name={field.name}
            id={field.name}
            required
            className={inputClasses || "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"}
          />
        </div>
      ))}
      <div>
        {/* כפתור הגשה עם אפשרות להוסיף קלאסים מותאמים */}
        <button
          type="submit"
          className={buttonClasses || "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"}
        >
          {submitButtonText}
        </button>
      </div>
    </form>
  );
};

export default ReusableForm;
