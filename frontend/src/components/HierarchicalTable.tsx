import React, { useState, useEffect } from 'react';
import HierarchicalTableItem from '../models/HierarchicalTableItem.ts';
import '../css/HierarchicalTable.css';

interface HierarchicalTableProps {
  data: HierarchicalTableItem[];
  onSelectItem: (item: HierarchicalTableItem) => void;
}

const HierarchicalTable: React.FC<HierarchicalTableProps> = ({ data, onSelectItem }) => {
  const [tableData, setTableData] = useState<HierarchicalTableItem[]>(data);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [editedData, setEditedData] = useState<HierarchicalTableItem[]>(data);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const toggleRow = (id: number) => {
    setExpandedRows((prev) => 
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleInputChange = (id: number, field: string, value: any, isSubItem = false, parentId: number | null = null) => {
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

  return (
    <div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Артикул</th>
            <th>Наименование</th>
            <th>Количество</th>
            <th>Цена</th>
            <th>Сумма</th>
          </tr>
        </thead>
        <tbody>
        {tableData.map((item) => (
        <React.Fragment key={`main-${item.id}`}>
          <tr key={`main-${item.id}`} onClick={() => toggleRow(item.id)} className="main-row">
            <td>
              <span className={`arrow ${expandedRows.includes(item.id) ? 'expanded' : 'collapsed'}`}>&#9660;</span>
              <input
                type="text"
                value={item.article}
                onChange={(e) => handleInputChange(item.id, 'article', e.target.value)}
              />
            </td>
            <td>
              <input
                type="text"
                value={item.name}
                onChange={(e) => handleInputChange(item.id, 'name', e.target.value)}
              />
            </td>
            <td>
              <input
                type="number"
                value={item.amount}
                onChange={(e) => handleInputChange(item.id, 'amount', parseInt(e.target.value))}
              />
            </td>
            <td>
              <input
                type="text"
                value={item.price}
                onChange={(e) => handleInputChange(item.id, 'price', e.target.value)}
              />
            </td>
            <td>
              <input
                type="text"
                value={item.totalPrice}
                onChange={(e) => handleInputChange(item.id, 'totalPrice', e.target.value)}
              />
            </td>
          </tr>
          {item.subItems && expandedRows.includes(item.id) && item.subItems.map((subItem) => (
            <tr
              key={`sub-${subItem.id}`}
              className={`sub-row ${expandedRows.includes(item.id) ? 'expanded' : ''}`}
              onClick={() => onSelectItem(subItem)}
            >
              <td>
                <input
                  type="text"
                  value={subItem.article}
                  onChange={(e) => handleInputChange(subItem.id, 'article', e.target.value, true, item.id)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={subItem.name}
                  onChange={(e) => handleInputChange(subItem.id, 'name', e.target.value, true, item.id)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={subItem.amount}
                  onChange={(e) => handleInputChange(subItem.id, 'amount', parseInt(e.target.value), true, item.id)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={subItem.price}
                  onChange={(e) => handleInputChange(subItem.id, 'price', e.target.value, true, item.id)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={subItem.totalPrice}
                  onChange={(e) => handleInputChange(subItem.id, 'totalPrice', e.target.value, true, item.id)}
                />
              </td>
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
