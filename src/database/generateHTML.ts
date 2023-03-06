export const incomeStatementHTML = (
  arr: transactionsIncStat[],
  header: string,
): string => {
  let incSum = arr
    .filter(el => el.TYPE === 'INCOME')
    .reduce((sum, el) => sum + el.AMOUNT, 0);
  let expSum = arr
    .filter(el => el.TYPE === 'EXPENSE')
    .reduce((sum, el) => sum + el.AMOUNT, 0);

  let html = `<div>
      <h2 style="text-align: center"><span style="border-bottom: 0.1rem solid black">TrackIT</span></h2>
      <h3 style="text-align: center"><span style="border-bottom: 0.1rem solid black">Income Statement ${header}</span></h3>
      <div>
        <table style="width: 90%; margin: auto; border-collapse: collapse">
          <tr style="border-bottom: 0.1rem solid black">
            <th style="text-align: left">INCOME</th>
            <th style="text-align: right"></th>
            <th style="text-align: right"></th>
          </tr>
          ${arr
            .filter(el => el.TYPE === 'INCOME')
            .map(
              el =>
                `<tr>
                    <td style="text-align: left">${el.NAME}</td>
                    <td style="text-align: right"></td>
                    <td style="text-align: right">${el.AMOUNT}</td>
                  </tr>`,
            )
            .join('')}
          <tr style="border-top: 0.1rem solid black">
            <th style="text-align: left"></th>
            <th style="text-align: right"></th>
            <th style="text-align: right">${incSum}</th>
          </tr>
          <tr style="border-bottom: 0.1rem solid black">
            <th style="text-align: left">EXPENSES</th>
            <th style="text-align: right"></th>
            <th style="text-align: right"></th>
          </tr>
          ${arr
            .filter(el => el.TYPE === 'EXPENSE')
            .map(
              el =>
                `<tr>
              <td style="text-align: left">${el.NAME}</td>
              <td style="text-align: right">${el.AMOUNT}</td>
              <td style="text-align: right"></td>
              </tr>`,
            )
            .join('')}
              <tr style="border-top: 0.1rem solid black">
              <th style="text-align: left"></th>
              <th style="text-align: right">${expSum}</th>
              <th style="text-align: right"></th>
              </tr>
              <tr style="border-bottom: 0.1rem solid black">
                <th style="text-align: left">NET INCOME</th>
                <th style="text-align: right"></th>
                <th style="text-align: right">${incSum - expSum}</th>
              </tr>

        </table>
      </div>
    </div>`;
  console.log(html);
  return html;
};
