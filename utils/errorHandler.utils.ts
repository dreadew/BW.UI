import type { ErrorResult, IProblemDetails } from '~/types/api.types';

export function useApiErrorHandler() {
    const toast = useToast();
    
    const handleError = (error: unknown): void => {
        if (!error) {
            toast.add({
                color: 'error',
                title: 'Ошибка!',
                description: 'Произошла неизвестная ошибка',
            });
            return;
        }
        
        if (error instanceof Error) {
            const problemDetails = extractProblemDetails(error);
            
            if (problemDetails) {
                handleProblemDetails(problemDetails);
                return;
            }
            
            toast.add({
                color: 'error',
                title: 'Ошибка!',
                description: error.message || 'Произошла ошибка',
            });
            return;
        }
        
        toast.add({
            color: 'error',
            title: 'Ошибка!',
            description: typeof error === 'string' ? error : 'Произошла неизвестная ошибка',
        });
    };

    const extractProblemDetails = (error: Error): IProblemDetails | null => {
        try {
            if (error.message.startsWith('{') && error.message.endsWith('}')) {
                return JSON.parse(error.message) as IProblemDetails;
            }
            return null;
        } catch {
            return null;
        }
    };
    
    const handleProblemDetails = (problem: IProblemDetails): ErrorResult => {
        const fieldErrors: Record<string, string> = {};
        
        if (problem.status === 400 && problem.errors) {
            Object.entries(problem.errors).forEach(([field, messages]) => {
                if (Array.isArray(messages) && messages.length > 0) {
                    fieldErrors[field] = messages[0];
                } else if (typeof messages === 'string') {
                    fieldErrors[field] = messages;
                }
            });
        }
        
        let message: string;
        
        switch (problem.status) {
            case 400:
                if (Object.keys(fieldErrors).length > 0) {
                    const firstField = Object.keys(fieldErrors)[0];
                    message = `${problem.title || 'Ошибка валидации'}: ${fieldErrors[firstField]}`;
                } else {
                    message = problem.detail || problem.title || 'Некорректный запрос';
                }
                break;
            case 401:
                message = 'Необходима аутентификация. Пожалуйста войдите в аккаунт';
                break;
            case 403:
                message = 'У вас нет доступа к этой странице';
                break;
            case 404:
                message = 'Запрашиваемый ресурс не найден';
                break;
            case 500:
                message = 'Серверная ошибка. Попробуйте повторить позже';
                break;
            default:
                message = problem.detail || problem.title || 'Произошла ошибка';
        }
        
        toast.add({
            color: 'error',
            title: 'Ошибка!',
            description: message,
        });
        return { message, fieldErrors: Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined };
    };
    
    return { handleError };
}