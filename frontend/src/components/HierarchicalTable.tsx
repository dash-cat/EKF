import React, { useState, useEffect } from 'react';
import HierarchicalTableItem from '../models/HierarchicalTableItem.ts';
import '../css/HierarchicalTable.css';

interface HierarchicalTableProps {
  data: HierarchicalTableItem[];
  onSelectItem: (item: HierarchicalTableItem) => void;
}

const fields = [{
  id: 'article',
  type: 'text',
  name: 'Артикул',
}, {
  id: 'name',
  type: 'text',
  name: 'Наименование',
}, {
  id: 'amount',
  type: 'number',
  name: 'Шт.',
}, {
  id: 'price',
  type: 'text',
  name: 'Цена, руб.',
}, {
  id: 'totalPrice',
  type: 'text',
  name: 'Сумма, руб.',
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

  return (
    <div>
      <table className="data-table">
        <thead>
          <tr>
            {fields.map((field) => (
              <th>{field.name}</th>
            ))}
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
              {fields.map((field) => (
                <td key={field.id} className="table-row">
                  <input
                    type={field.type}
                    value={subItem[field.id]}
                    onChange={(e) => handleInputChange(
                      subItem.id,
                      field.id,
                      (field.type === 'number'
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
