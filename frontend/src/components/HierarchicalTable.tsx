import React, { useState, useEffect } from 'react';
import '../css/HierarchicalTable.css';

interface Item {
  id: number;
  article: string;
  name: string;
  amount: number;
  price: string;
  totalPrice: string;
  subItems?: Item[];
}

interface HierarchicalTableProps {
  data: Item[];
  onSave: (data: Item[]) => void;
}

const HierarchicalTable: React.FC<HierarchicalTableProps> = ({ data, onSave }) => {
  const [tableData, setTableData] = useState<Item[]>(data);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [editedData, setEditedData] = useState<Item[]>(data);

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

  const handleSave = () => {
    onSave(tableData);
  };

  const downloadCSV = () => {
    const rows = [
      ["Артикул", "Наименование", "Количество", "Цена", "Сумма"],
      ...tableData.map(item => [
        item.article,
        item.name,
        item.amount,
        item.price,
        item.totalPrice
      ])
    ];

    const csvContent = "data:text/csv;charset=utf-8," 
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "table_data.csv");
    document.body.appendChild(link);

    link.click();
  };

  const downloadXML = () => {
    let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n<items>\n';
    
    tableData.forEach(item => {
      xmlContent += `  <item>\n`;
      xmlContent += `    <article>${item.article}</article>\n`;
      xmlContent += `    <name>${item.name}</name>\n`;
      xmlContent += `    <amount>${item.amount}</amount>\n`;
      xmlContent += `    <price>${item.price}</price>\n`;
      xmlContent += `    <totalPrice>${item.totalPrice}</totalPrice>\n`;
      if (item.subItems) {
        item.subItems.forEach(subItem => {
          xmlContent += `    <subItem>\n`;
          xmlContent += `      <article>${subItem.article}</article>\n`;
          xmlContent += `      <name>${subItem.name}</name>\n`;
          xmlContent += `      <amount>${subItem.amount}</amount>\n`;
          xmlContent += `      <price>${subItem.price}</price>\n`;
          xmlContent += `      <totalPrice>${subItem.totalPrice}</totalPrice>\n`;
          xmlContent += `    </subItem>\n`;
        });
      }
      xmlContent += `  </item>\n`;
    });

    xmlContent += '</items>';

    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'table_data.xml';
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div>
        <div className='table-button'>
        <button className="save-button" onClick={handleSave}>Сохранить изменения</button>
        <button className="export-button" onClick={downloadCSV}>Выгрузить в CSV</button>
        <button className="export-button" onClick={downloadXML}>Выгрузить в XML</button>
    </div>
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
            <React.Fragment key={item.id}>
              <tr onClick={() => toggleRow(item.id)} className="main-row">
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
                <tr key={subItem.id} className={`sub-row ${expandedRows.includes(item.id) ? 'expanded' : ''}`}>
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
