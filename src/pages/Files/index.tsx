// src/pages/Files/index.tsx

import React from 'react';
import { Table, Tag, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface DataType {
  key: string;
  name: string;
  size: string;
  type: string;
  lastModified: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Size',
    dataIndex: 'size',
    key: 'size',
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    render: (type) => (
      <Tag color={type === 'Folder' ? 'blue' : 'green'}>{type}</Tag>
    ),
  },
  {
    title: 'Last Modified',
    dataIndex: 'lastModified',
    key: 'lastModified',
  },
];

const data: DataType[] = [
  {
    key: '1',
    name: 'Document.docx',
    size: '15 KB',
    type: 'File',
    lastModified: '2023-07-06 10:30',
  },
  {
    key: '2',
    name: 'Images',
    size: '---',
    type: 'Folder',
    lastModified: '2023-07-05 14:20',
  },
  {
    key: '3',
    name: 'Presentation.pptx',
    size: '5.2 MB',
    type: 'File',
    lastModified: '2023-07-04 09:15',
  },
];

const Files: React.FC = () => {
  return (
    <div>
      <h1>Files</h1>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default Files;