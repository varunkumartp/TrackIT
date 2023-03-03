export const DateFilterString = (date: DateFilter): string => {
  return date.month === -1
    ? `DATE BETWEEN '${date.year - 1}-04-01' and '${date.year}-04-01'`
    : date.month !== 0
    ? `strftime('%m', DATE) = '${date.month.toString().padStart(2, '0')}' AND
               strftime('%Y', DATE) = '${date.year}'`
    : `strftime('%Y', DATE) = '${date.year}'`;
};
