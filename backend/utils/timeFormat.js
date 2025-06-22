// formatting timestamp to a readable format
export const formatTimestamp = (timestamp) => {
  return new Date(timestamp).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};
