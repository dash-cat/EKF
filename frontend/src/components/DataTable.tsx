import React from 'react';
import './css/DataTable.css';

interface DataTableProps {
  data: Array<{
    article: string;
    name: string;
    amount: number;
    price: string;
    totalPrice: string;
  }>;
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  return (
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
        {data.map((item, index) => (
          <tr key={index}>
            <td>{item.article}</td>
            <td>{item.name}</td>
            <td>{item.amount}</td>
            <td>{item.price}</td>
            <td>{item.totalPrice}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;
