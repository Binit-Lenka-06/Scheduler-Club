"use client"


import React, { useState } from 'react';
import { Forms, Registration } from '@/types';
import { useSearchParams } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Content, DynamicBackground, TDocumentDefinitions } from 'pdfmake/interfaces';




interface SearchBarProps {
  formsfetched: Forms[];
  fetchedRegisters: Registration[];
}


const SearchBar: React.FC<SearchBarProps> = ({ formsfetched, fetchedRegisters }) => {

  const searchParams = useSearchParams();
  const search = searchParams.get('id');


  const { user } = useUser();


  console.log(search);
  const exportToExcel = () => {
    const table = document.getElementById('your-table-id');
  
    if (!table) {
      console.error('Table element not found');
      return;
    }
  
    const wb = XLSX.utils.table_to_book(table);
    // const blob = XLSX.write(wb, { bookType: 'xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', type: 'blob' });
    XLSX.writeFile(wb, 'table_data.xlsx');
  
    const link = document.createElement('a') as HTMLAnchorElement;
    // link.href = URL.createObjectURL(blob as any);
    link.download = 'table_data.xlsx';
    link.click();
  };

  const [exportPDF, setExportPDF] = useState(false)
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  const handleExport = () => {
    setExportPDF(true)
    const table = document.getElementById('your-table-id');

    if (table) {
      html2canvas(table).then((canvas) => {
        const data = canvas.toDataURL();
        const docDefinition = {
          content: [{
            image: data,
            width: 500
          }],
          defaultStyle: {
            color: '#000' // Set text color to black
          },
          background: {
            color: '#000'
          } as Content | DynamicBackground
        };
        pdfMake.createPdf(docDefinition).download('customer-details.pdf');
      });
      setExportPDF(false)
    } else {
      console.error("Table element not found");
      setExportPDF(false)
    }
  };
  
  const formsFetchedComponentIds = formsfetched
    .filter((items) => items.formId === search)
    .map((data) => data.componentId);

  const filteredRegisters = fetchedRegisters
    .filter((items) => formsFetchedComponentIds.includes(items.component_id))
    .filter((items) => items.component_value !== '');
  
    const uniqueUserIds = Array.from(new Set(filteredRegisters.map((data) => data.user_id)));
    console.log(uniqueUserIds)

  return (
    <div>
      {uniqueUserIds.length === 0 ? (
        <div className='text-neutral-500'>
          No Responses Found
        </div>
      ):(
        <div></div>
      )}
      <button onClick={exportToExcel}>Export to Excel</button>
      <button onClick={handleExport} className='ml-12'>Export to PDF</button>
      <table className={`border-collapse w-full ${exportPDF? "text-black": ""}`} id='your-table-id'>
        <thead>
          <tr className='border-b'>
            <th className='border p-2 font-semibold text-lg truncate'>Registry User Code</th>
            {formsfetched
              .filter((items) => items.formId === search)
              .map((data) => (
                <th key={data.formId} className='border p-2 font-semibold text-lg truncate' style={{ maxWidth: '150px' }}>
                  {data.componentName}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {uniqueUserIds.map((item, index) => (
            <tr key={index}>
              <td className={`border overflow-hidden whitespace-nowrap text-center ${exportPDF ? "py-2": ""}`} title='Registry Email Value'>
                <span className='hover:underline cursor-pointer'>{item}</span>
              </td>
              {user && filteredRegisters.filter((userid) => userid.user_id === item).map((data) => (
                <td key={data.component_id} className='border overflow-hidden max-w-2xl whitespace-nowrap'>
                  {data.component_value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};



export default SearchBar;
