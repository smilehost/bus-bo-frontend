import { saveAs } from 'file-saver';
import Papa from 'papaparse';

type ColumnConfig<T> = {
  key: keyof T | string;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
};

export function exportCSV<T extends Record<string, any>>(
  data: T[],
  columns: ColumnConfig<T>[],
  fileName = 'export.csv'
) {
  const headers = columns.map((col) => col.label);
  const keys = columns.map((col) => col.key);

  const rows = data.map((row) =>
    keys.map((key, i) => {
      const col = columns[i];
      const rawValue = row[key as keyof T];

      if (col.render) {
        const rendered = col.render(rawValue, row);
        if (typeof rendered === 'string') return rendered;
        if (typeof rendered === 'number') return rendered.toString();
        if (typeof rendered === 'boolean') return rendered ? 'true' : 'false';
        return (rendered as any)?.props?.children ?? '';
      }

      return rawValue ?? '';
    })
  );

  const csv = Papa.unparse({
    fields: headers,
    data: rows,
  });

  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, fileName);
}