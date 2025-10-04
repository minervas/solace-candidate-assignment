/**
 * Formats a phone number into a readable format.
 * Assumes US phone number format (10 digits).
 * 
 * @param phoneNumber - The phone number as a number or string
 * @returns Formatted phone number string (e.g., "(555) 123-4567")
 */
export function formatPhoneNumber(phoneNumber: number | string): string {
  // Convert to string and remove any non-digit characters
  // /D is any character that is not a digit
  const cleaned = String(phoneNumber).replace(/\D/g, '');
  
  // Check if we have a valid 10-digit US phone number
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  // Check if we have an 11-digit number (with country code 1)
  if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  // If not a standard format, return as-is
  return String(phoneNumber);
}
