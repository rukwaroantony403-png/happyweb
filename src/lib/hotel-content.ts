export const hotelPhone = "+254742501856";
export const hotelPhoneDisplay = "+254 742 501 856";

export function hotelPhoto(id: string, width = 1100) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`;
}
