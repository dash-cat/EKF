import React, { useState, useEffect } from 'react';
import HierarchicalTableItem from '../models/HierarchicalTableItem.ts';
import '../css/HierarchicalTable.css';

interface HierarchicalTableProps {
  data: HierarchicalTableItem[];
  onSelectItem: (item: HierarchicalTableItem) => void;
}

interface TableColumn {
  id: string;
  type: 'text' | 'number';
  name: string;
  width?: number;
}

type StyleForColumnGetter = (column: TableColumn) => object;

const columns: TableColumn[] = [{
  id: 'article',
  type: 'text',
  name: 'Артикул',
  width: 100,
}, {
  id: 'name',
  type: 'text',
  name: 'Наименование',
}, {
  id: 'amount',
  type: 'number',
  name: 'Шт.',
  width: 30,
}, {
  id: 'price',
  type: 'text',
  name: 'Цена, руб.',
  width: 100,
}, {
  id: 'totalPrice',
  type: 'text',
  name: 'Сумма, руб.',
  width: 120,
}];

const HierarchicalTable: React.FC<HierarchicalTableProps> = ({ data, onSelectItem }) => {
  const [tableData, setTableData] = useState<HierarchicalTableItem[]>(data);
  const [expandedRows, setExpandedRows] = useState<number[]>([1]);
  const [editedData, setEditedData] = useState<HierarchicalTableItem[]>(data);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const toggleRow = (id: number) => {
    setExpandedRows((prev) => 
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleInputChange = (
    id: number,
    field: string,
    value: any,
    isSubItem = false,
    parentId: number | null = null
  ) => {
    setTableData((prevData) =>
      prevData.map((item) => {
        if (item.id === id && !isSubItem) {
          return { ...item, [field]: value };
        }
        if (isSubItem && item.id === parentId) {
          return {
            ...item,
            subItems: item.subItems?.map((subItem) =>
              subItem.id === id ? { ...subItem, [field]: value } : subItem
            ),
          };
        }
        return item;
      })
    );
  };

  const styleForColumn: StyleForColumnGetter = (column: TableColumn) => {
    return { width: column.width ?? 'auto' }
  }

  return (
    <div>
      <table className="data-table">
        <colgroup>
          {columns.map((column) => (
            <col span={1} style={styleForColumn(column)} />
          ))}
        </colgroup>
        <thead>
          <tr>
            {columns.map((column) => (
              <th>
                {column.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
        {tableData.map((item) => (
        <React.Fragment key={`main-${item.id}`}>
          <tr key={`main-${item.id}`} onClick={() => toggleRow(item.id)} className="main-row">
            {columns.map((column) => (
              // <span className={`arrow ${expandedRows.includes(item.id) ? 'expanded' : 'collapsed'}`}>&#9660;</span>
              <td key={column.id}>
                <input
                  type={column.type}
                  value={item[column.id]}
                  style={styleForColumn(column)}
                  onChange={(e) => handleInputChange(item.id, column.id, column.type === 'number' ? parseInt(e.target.value) : e.target.value)}
                />
              </td>
            ))}
          </tr>
          {item.subItems && expandedRows.includes(item.id) && item.subItems.map((subItem) => (
            <tr
              key={`sub-${subItem.id}`}
              className={`sub-row ${expandedRows.includes(item.id) ? 'expanded' : ''}`}
              onClick={() => onSelectItem(subItem)}
            >
              {columns.map((column) => (
                <td key={column.id} className="table-row">
                  <input
                    type={column.type}
                    value={subItem[column.id]}
                    style={styleForColumn(column)}
                    onChange={(e) => handleInputChange(
                      subItem.id,
                      column.id,
                      (column.type === 'number'
                       ? parseInt(e.target.value)
                       : e.target.value),
                      true,
                      item.id
                    )}
                  />
                </td>
              ))}
            </tr>
          ))}
        </React.Fragment>
      ))}

        </tbody>
      </table>
    </div>
  );
};

export default HierarchicalTable;
