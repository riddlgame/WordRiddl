
export const getFormattedDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const parseDMY = (dmyString: string): Date => {
    if (!dmyString || !dmyString.includes('/')) return new Date();
    const parts = dmyString.split('/');
    if (parts.length !== 3) return new Date();
    
    const [day, month, year] = parts.map(Number);
    // Month is 0-indexed in JS Date constructor
    return new Date(year, month - 1, day);
};

export const convertToInputFormat = (dmyString: string): string => {
    if (!dmyString || !dmyString.includes('/')) {
      const today = new Date();
      const year = today.getFullYear();
      const month = (today.getMonth() + 1).toString().padStart(2, '0');
      const day = today.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    const [day, month, year] = dmyString.split('/');
    return `${year}-${month}-${day}`;
};

export const convertFromInputFormat = (ymdString: string): string => {
    if (!ymdString || !ymdString.includes('-')) {
        return getFormattedDate(new Date());
    }
    const [year, month, day] = ymdString.split('-');
    return `${day}/${month}/${year}`;
};
