import React from 'react';
import { Button } from '@/components/ui/button';

interface CommandTableProps<T> {
  data: T[];
  columns: {
    key: keyof T;
    header: string;
  }[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
}

function CommandTable<T>({ data, columns, onEdit, onDelete }: CommandTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-discord-light text-sm border-b border-discord-light/10">
            {columns.map((column) => (
              <th key={column.key as string} className="pb-2 font-medium">
                {column.header}
              </th>
            ))}
            <th className="pb-2 font-medium">İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1} className="py-4 text-center text-discord-light">
                Veri bulunamadı
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr key={index} className={index < data.length - 1 ? "border-b border-discord-light/10" : ""}>
                {columns.map((column) => (
                  <td key={column.key as string} className="py-3">
                    {String(item[column.key] || '')}
                  </td>
                ))}
                <td className="py-3">
                  <div className="flex space-x-1">
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(item)}
                        className="p-1 text-discord-light hover:text-discord-lightest h-auto"
                      >
                        <i className="ri-edit-line"></i>
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(item)}
                        className="p-1 text-discord-light hover:text-discord-danger h-auto"
                      >
                        <i className="ri-delete-bin-line"></i>
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default CommandTable;
