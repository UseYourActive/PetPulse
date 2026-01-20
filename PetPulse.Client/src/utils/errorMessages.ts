import { AxiosError } from 'axios';

export type PageContext = 
  | 'login' 
  | 'register' 
  | 'appointments' 
  | 'pets' 
  | 'owners' 
  | 'vets'
  | 'home';

export type ActionType = 'load' | 'create' | 'update' | 'delete' | 'login' | 'register';

interface ErrorMessages {
  [key: string]: {
    [key: string]: string;
  };
}

const errorMessages: ErrorMessages = {
  login: {
    '401': 'Invalid username or password. Please check your credentials and try again.',
    '403': 'Your account has been restricted. Please contact support.',
    '404': 'User account not found. Please check your username.',
    '500': 'Server error occurred. Please try again later.',
    default: 'Login failed. Please check your credentials and try again.',
  },
  register: {
    '400': 'Invalid registration data. Please check all fields.',
    '409': 'Username or email already exists. Please use different credentials.',
    '422': 'Registration data validation failed. Please check all fields.',
    '500': 'Server error occurred during registration. Please try again later.',
    default: 'Registration failed. Please try again.',
  },
  appointments: {
    load: {
      '401': 'You must be logged in to view appointments.',
      '403': 'You do not have permission to view appointments.',
      '404': 'No appointments found.',
      '500': 'Failed to load appointments. Please try again later.',
      default: 'Failed to load appointments. Please try again.',
    },
    create: {
      '400': 'Invalid appointment data. Please check all fields.',
      '401': 'You must be logged in to schedule appointments.',
      '403': 'You do not have permission to schedule appointments.',
      '404': 'Pet or veterinarian not found.',
      '409': 'Appointment time conflict. Please choose a different time.',
      '500': 'Failed to schedule appointment. Please try again later.',
      default: 'Failed to schedule appointment. Please try again.',
    },
    update: {
      '400': 'Invalid appointment data. Please check all fields.',
      '401': 'You must be logged in to update appointments.',
      '403': 'You do not have permission to update this appointment.',
      '404': 'Appointment not found.',
      '500': 'Failed to update appointment. Please try again later.',
      default: 'Failed to update appointment. Please try again.',
    },
    delete: {
      '401': 'You must be logged in to cancel appointments.',
      '403': 'You do not have permission to cancel this appointment.',
      '404': 'Appointment not found.',
      '500': 'Failed to cancel appointment. Please try again later.',
      default: 'Failed to cancel appointment. Please try again.',
    },
  },
  pets: {
    load: {
      '401': 'You must be logged in to view pets.',
      '403': 'You do not have permission to view pets.',
      '404': 'No pets found.',
      '500': 'Failed to load pets. Please try again later.',
      default: 'Failed to load pets. Please try again.',
    },
    create: {
      '400': 'Invalid pet data. Please check all fields.',
      '401': 'You must be logged in to add pets.',
      '403': 'You do not have permission to add pets.',
      '500': 'Failed to add pet. Please try again later.',
      default: 'Failed to add pet. Please try again.',
    },
    update: {
      '400': 'Invalid pet data. Please check all fields.',
      '401': 'You must be logged in to update pets.',
      '403': 'You do not have permission to update this pet.',
      '404': 'Pet not found.',
      '500': 'Failed to update pet. Please try again later.',
      default: 'Failed to update pet. Please try again.',
    },
    delete: {
      '401': 'You must be logged in to delete pets.',
      '403': 'You do not have permission to delete this pet.',
      '404': 'Pet not found.',
      '500': 'Failed to delete pet. Please try again later.',
      default: 'Failed to delete pet. Please try again.',
    },
  },
  owners: {
    load: {
      '401': 'You must be logged in to view owners.',
      '403': 'You do not have permission to view owners.',
      '404': 'No owners found.',
      '500': 'Failed to load owners. Please try again later.',
      default: 'Failed to load owners. Please try again.',
    },
    create: {
      '400': 'Invalid owner data. Please check all fields.',
      '401': 'You must be logged in to add owners.',
      '403': 'You do not have permission to add owners.',
      '409': 'Owner with this email already exists.',
      '500': 'Failed to add owner. Please try again later.',
      default: 'Failed to add owner. Please try again.',
    },
    update: {
      '400': 'Invalid owner data. Please check all fields.',
      '401': 'You must be logged in to update owners.',
      '403': 'You do not have permission to update this owner.',
      '404': 'Owner not found.',
      '500': 'Failed to update owner. Please try again later.',
      default: 'Failed to update owner. Please try again.',
    },
    delete: {
      '401': 'You must be logged in to delete owners.',
      '403': 'You do not have permission to delete this owner.',
      '404': 'Owner not found.',
      '500': 'Failed to delete owner. Please try again later.',
      default: 'Failed to delete owner. Please try again.',
    },
  },
  vets: {
    load: {
      '401': 'You must be logged in to view veterinarians.',
      '403': 'You do not have permission to view veterinarians.',
      '404': 'No veterinarians found.',
      '500': 'Failed to load veterinarians. Please try again later.',
      default: 'Failed to load veterinarians. Please try again.',
    },
    create: {
      '400': 'Invalid veterinarian data. Please check all fields.',
      '401': 'You must be logged in to add veterinarians.',
      '403': 'Only administrators can add veterinarians.',
      '500': 'Failed to add veterinarian. Please try again later.',
      default: 'Failed to add veterinarian. Please try again.',
    },
    update: {
      '400': 'Invalid veterinarian data. Please check all fields.',
      '401': 'You must be logged in to update veterinarians.',
      '403': 'Only administrators can update veterinarians.',
      '404': 'Veterinarian not found.',
      '500': 'Failed to update veterinarian. Please try again later.',
      default: 'Failed to update veterinarian. Please try again.',
    },
    delete: {
      '401': 'You must be logged in to delete veterinarians.',
      '403': 'Only administrators can delete veterinarians.',
      '404': 'Veterinarian not found.',
      '500': 'Failed to delete veterinarian. Please try again later.',
      default: 'Failed to delete veterinarian. Please try again.',
    },
  },
};

/**
 * Formats an error message based on page context, action type, and HTTP status code
 * @param error - The error object (AxiosError or Error)
 * @param pageContext - The page where the error occurred
 * @param actionType - The action that caused the error (optional for login/register)
 * @returns A user-friendly error message
 */
export const getErrorMessage = (
  error: AxiosError | Error | unknown,
  pageContext: PageContext,
  actionType?: ActionType
): string => {
  // Extract status code from AxiosError
  let statusCode: string | undefined;
  let serverMessage: string | undefined;

  if (error instanceof AxiosError) {
    statusCode = error.response?.status?.toString();
    serverMessage = error.response?.data?.message;
  } else if (error instanceof Error) {
    // Try to extract status from error message
    const statusMatch = error.message.match(/status code (\d+)/i);
    if (statusMatch) {
      statusCode = statusMatch[1];
    }
    serverMessage = error.message;
  }

  // For login and register, use simple structure
  if (pageContext === 'login' || pageContext === 'register') {
    const pageErrors = errorMessages[pageContext];
    if (statusCode && pageErrors[statusCode]) {
      return pageErrors[statusCode];
    }
    return pageErrors.default;
  }

  // For other pages, use action-based structure
  if (actionType && errorMessages[pageContext]?.[actionType]) {
    const actionErrors = errorMessages[pageContext][actionType];
    if (statusCode && actionErrors[statusCode]) {
      return actionErrors[statusCode];
    }
    return actionErrors.default;
  }

  // Fallback: try to use server message if available
  if (serverMessage && serverMessage !== 'Request failed with status code ' + statusCode) {
    return serverMessage;
  }

  // Final fallback
  return 'An error occurred. Please try again.';
};
