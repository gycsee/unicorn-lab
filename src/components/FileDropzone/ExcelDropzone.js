import React from 'react';
import XLSX from 'xlsx';
import { FileExcelOutlined } from '@ant-design/icons';

import SingleFileDropzone from './SingleFileDropzone';

const ExcelDropzone = ({
  onChange = () => {}
}) => {
  const handleFileChange = f => {
    if (f) {
      let reader = new FileReader();
      reader.onload = e => {
        var data = new Uint8Array(e.target.result);
        var workbook = XLSX.read(data, { type: 'array' });
        const first_worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(first_worksheet, { header: 1, raw: false, blankrows: false });
        onChange(rows, f)
      };
      reader.readAsArrayBuffer(f);
    } else {
      onChange([], f)
    }
  }

  return (
    <SingleFileDropzone
      onChange={handleFileChange}
      accept={[".xlsx"]}
      fileIcon={<FileExcelOutlined />}
    />
  );
}

export default ExcelDropzone;
