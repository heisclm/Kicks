export function handleActionError(error: unknown, defaultMessage = "An unexpected error occurred. Please try again."): string {
  console.error('[Action Error]', error);

  if (error instanceof Error) {
    // Sanitize database errors before returning to the client to prevent leaking infrastructure details.
    if (error.message.includes('row-level security')) {
      return "You do not have permission to perform this action.";
    }
  }

  return defaultMessage;
}
