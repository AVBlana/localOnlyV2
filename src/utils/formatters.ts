export const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`;
};

export const formatRating = (rating: number): string => {
  return rating.toFixed(1);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

