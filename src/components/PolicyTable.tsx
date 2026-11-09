type PolicyTableProps = {
  caption: string;
  headers: string[];
  rows: string[][];
};

const PolicyTable = ({ caption, headers, rows }: PolicyTableProps) => {
  return (
    <table className="w-full table-fixed border-collapse text-left">
      <caption className="sr-only">{caption}</caption>
      <thead>
        <tr className="bg-neutral-009 text-neutral-002">
          {headers.map((header) => (
            <th
              key={header}
              scope="col"
              className="border border-neutral-008 px-3 py-2 font-medium"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row[0]}>
            {row.map((cell, index) => (
              <td
                key={index}
                className="border border-neutral-008 px-3 py-2 align-top wrap-anywhere"
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PolicyTable;
