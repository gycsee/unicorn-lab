import React from 'react';
import XLSX from 'xlsx';
import { csvParseRows } from 'd3-dsv';
import { FileTextOutlined } from '@ant-design/icons';

import SingleFileDropzone from './SingleFileDropzone';

const CsvExcelDropzone = ({
  onChange = () => {}
}) => {
  const handleFileChange = f => {
    if (f) {
      let fileReader = new FileReader();
      if (f.name.endsWith('.text') || f.name.endsWith('.csv')) {
        fileReader.onload = e => {
          const rows = csvParseRows(e.target.result).filter(item => item.length > 1 || item[0] !== '');
          onChange(rows, f)
        };
        fileReader.readAsText(f);
      }
      if (f.name.endsWith('.xlsx')) {
        fileReader.onload = e => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const first_worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const rows = XLSX.utils.sheet_to_json(first_worksheet, { header: 1 });
          onChange(rows, f)
        };
        fileReader.readAsArrayBuffer(f);
      }
    } else {
      onChange([], f)
    }
  }

  return (
    <SingleFileDropzone
      onChange={handleFileChange}
      accept={[".text", ".csv", ".xlsx"]}
      fileIcon={<FileTextOutlined />}
    />
  );
}

export default CsvExcelDropzone;
