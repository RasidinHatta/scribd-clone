import { CheckCheckIcon } from "lucide-react"

interface FormSuccessProps {
  message?: string;
}

export const FormSuccess = ({ message }: FormSuccessProps) => {
  if (!message) return null;
  
  return (
    <div className="flex items-center gap-2 p-3 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-50">
      <CheckCheckIcon className="w-4 h-4 flex-shrink-0" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
};