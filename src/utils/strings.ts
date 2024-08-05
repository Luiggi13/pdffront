export const useStringUtils = () => {
  const truncateDescription = (description: string, len: number) => {
    var trimmedDescription = description.substring(0, Math.min(len, description.length)) + '...';
    return trimmedDescription;
  };

  return { truncateDescription };
};
