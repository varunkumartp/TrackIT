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
  return html;
};

export const balanceSheetHTML = (
  arr: transactionsIncStat[],
  header: string,
): string => {
  let assetSum = arr
    .filter(el => el.TYPE === 'Assets')
    .reduce((sum, el) => sum + el.AMOUNT, 0);
  let leqSum = arr
    .filter(el => el.TYPE === 'Liabilities' || el.TYPE === 'Equity')
    .reduce((sum, el) => sum + el.AMOUNT, 0);
  let html = `
    <div>
    <h2 style="text-align: center">
      <span style="border-bottom: 0.1rem solid black">TrackIT</span>
    </h2>
    <h3 style="text-align: center">
      <span style="border-bottom: 0.1rem solid black">Balance Sheet FY2022-2023</span>
    </h3>
    <div style="display: flex; flex-direction: column;">
      <div style="padding:  0.5rem">
        <table style="width: 100%; border-collapse: collapse">
          <tr style="border-bottom: 0.1rem solid black">
            <th style="text-align: left">ASSETS</th>
            <th style="text-align: center"></th>
            <th style="text-align: right"></th>
          </tr>
          ${arr
            .filter(el => el.TYPE === 'Assets')
            .map(el =>
              el.AMOUNT !== null
                ? `<tr>
                    <td style="text-align: left">${el.NAME}</td>
                    <td style="text-align: right"></td>
                    <td style="text-align: right">${el.AMOUNT}</td>
                  </tr>`
                : ``,
            )
            .join('')}
          <tr style="border-top: 0.1rem solid black">
            <th style="text-align: left">Total Assets</th>
            <th style="text-align: right"></th>
            <th style="text-align: right">${assetSum}</th>
          </tr>
          </tr>
        </table>
      </div>
      <div style="padding: 0.5rem ">
        <table style="width: 100%; border-collapse: collapse">
          <tr style="border-bottom: 0.1rem solid black">
            <th style="text-align: left">LIABILITIES</th>
            <th style="text-align: center"></th>
            <th style="text-align: right"></th>
          </tr>
          ${arr
            .filter(el => el.TYPE === 'Liabilities')
            .map(
              el =>
                `<tr>
              <td style="text-align: left">${el.NAME}</td>
              <td style="text-align: right"></td>
              <td style="text-align: right"><span style=${
                el.AMOUNT > 0 ? 'text-decoration:underline' : ''
              }>${el.AMOUNT * -1}</span></td>
              </tr>`,
            )
            .join('')}
        </table>
      </div>
      <div style="padding: 0.5rem ">
        <table style="width: 100%; border-collapse: collapse">
          <tr style="border-bottom: 0.1rem solid black">
            <th style="text-align: left">EQUITY</th>
            <th style="text-align: center"></th>
            <th style="text-align: right"></th>
          </tr>
          ${arr
            .filter(el => el.TYPE === 'Equity')
            .map(
              el =>
                `<tr>
              <td style="text-align: left">${el.NAME}</td>
              <td style="text-align: right"></td>
              <td style="text-align: right"><span style=${
                el.AMOUNT > 0 ? 'text-decoration:underline' : ''
              }>${el.AMOUNT * -1}</span></td>
              </tr>`,
            )
            .join('')}
          <tr style="border-top: 0.1rem solid black">
            <th style="text-align: left">Total Liabilities and Equity</th>
            <th style="text-align: right"></th>
            <th style="text-align: right"><span style=${
              leqSum > 0 ? 'text-decoration:underline' : ''
            }>${leqSum * -1}</span></th>
          </tr>
        </table>
      </div>
    </div>
  `;
  return html;
};
