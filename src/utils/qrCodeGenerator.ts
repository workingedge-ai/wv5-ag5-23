
export const generateQRCode = (text: string): string => {
  // Using a simple QR code API service
  const encodedText = encodeURIComponent(text);
  return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodedText}`;
};

export const generateContentUrl = (contentId: string): string => {
  // Return the URL to the agentic-text page with the content ID
  const baseUrl = window.location.origin;
  return `${baseUrl}/agentic-text?id=${contentId}`;
};
