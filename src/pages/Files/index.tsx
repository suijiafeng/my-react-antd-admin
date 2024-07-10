import React, { useState, useCallback, useMemo } from 'react';
import { Table, Tag, Button, Input, Modal, Form, Space, Select, Typography, Breadcrumb, Popconfirm } from 'antd';
import { FolderOutlined, FileOutlined, FileWordOutlined, FileExcelOutlined, FilePdfOutlined, FileImageOutlined, HomeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Text } = Typography;

interface FileNode {
  id: string;
  name: string;
  size: string;
  type: 'File' | 'Folder';
  extension?: string;
  lastModified: string;
  parentId: string | null;
}

const initialFileSystem: FileNode[] = [
  { id: 'root', name: 'Root', size: '---', type: 'Folder', lastModified: '2023-07-01 00:00', parentId: null },
  { id: '1', name: 'Document.docx', size: '15 KB', type: 'File', extension: 'docx', lastModified: '2023-07-06 10:30', parentId: 'root' },
  { id: '2', name: 'Images', size: '---', type: 'Folder', lastModified: '2023-07-05 14:20', parentId: 'root' },
  { id: '2-1', name: 'photo.jpg', size: '2.5 MB', type: 'File', extension: 'jpg', lastModified: '2023-07-05 14:15', parentId: '2' },
  { id: '3', name: 'Presentation.pptx', size: '5.2 MB', type: 'File', extension: 'pptx', lastModified: '2023-07-04 09:15', parentId: 'root' },
];

const FileExplorer: React.FC = () => {
  const [fileSystem, setFileSystem] = useState<FileNode[]>(initialFileSystem);
  const [currentFolderId, setCurrentFolderId] = useState<string>('root');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingFile, setEditingFile] = useState<FileNode | null>(null);
  const [form] = Form.useForm();

  const getFileIcon = (type: string, extension?: string) => {
    if (type === 'Folder') return <FolderOutlined style={{ fontSize: '24px', color: '#1890ff' }} />;
    switch (extension) {
      case 'docx':
      case 'doc':
        return <FileWordOutlined style={{ fontSize: '24px', color: '#2b579a' }} />;
      case 'xlsx':
      case 'xls':
        return <FileExcelOutlined style={{ fontSize: '24px', color: '#217346' }} />;
      case 'pdf':
        return <FilePdfOutlined style={{ fontSize: '24px', color: '#f40f02' }} />;
      case 'jpg':
      case 'png':
      case 'gif':
        return <FileImageOutlined style={{ fontSize: '24px', color: '#f9d71c' }} />;
      default:
        return <FileOutlined style={{ fontSize: '24px', color: '#8c8c8c' }} />;
    }
  };

  const columns: ColumnsType<FileNode> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          {getFileIcon(record.type, record.extension)}
          <a onClick={() => record.type === 'Folder' && setCurrentFolderId(record.id)}>
            <Text strong={record.type === 'Folder'}>{text}</Text>
          </a>
        </Space>
      ),
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
      render: (size, record) => (
        <Text type={record.type === 'Folder' ? 'secondary' : undefined}>
          {record.type === 'Folder' ? '---' : size}
        </Text>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={type === 'Folder' ? 'blue' : 'green'} style={{ width: '60px', textAlign: 'center' }}>
          {type}
        </Tag>
      ),
    },
    {
      title: 'Last Modified',
      dataIndex: 'lastModified',
      key: 'lastModified',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Are you sure to delete this item?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const currentFolderContents = useMemo(() => {
    return fileSystem.filter(item => item.parentId === currentFolderId);
  }, [fileSystem, currentFolderId]);

  const breadcrumbItems = useMemo(() => {
    const items: { id: string; name: string }[] = [];
    let currentId = currentFolderId||null;
    while (currentId !== null) {
      const folder = fileSystem.find(item => item.id === currentId);
      if (folder) {
        items.unshift({ id: folder.id, name: folder.name });
        currentId = folder.parentId;
      } else {
        break;
      }
    }
    return items;
  }, [fileSystem, currentFolderId]);

  const navigateUp = useCallback(() => {
    const currentFolder = fileSystem.find(item => item.id === currentFolderId);
    if (currentFolder && currentFolder.parentId) {
      setCurrentFolderId(currentFolder.parentId);
    }
  }, [fileSystem, currentFolderId]);

  const handleAddOrEdit = useCallback(() => {
    form.validateFields().then(values => {
      if (editingFile) {
        // Edit existing file/folder
        setFileSystem(prev => prev.map(item => 
          item.id === editingFile.id 
            ? { ...item, name: values.name, type: values.type, extension: values.type === 'File' ? values.name.split('.').pop() : undefined }
            : item
        ));
      } else {
        // Add new file/folder
        const newNode: FileNode = {
          id: Date.now().toString(),
          name: values.name,
          size: values.type === 'Folder' ? '---' : '0 KB',
          type: values.type,
          extension: values.type === 'File' ? values.name.split('.').pop() : undefined,
          lastModified: new Date().toLocaleString(),
          parentId: currentFolderId,
        };
        setFileSystem(prev => [...prev, newNode]);
      }
      setIsModalVisible(false);
      setEditingFile(null);
      form.resetFields();
    });
  }, [form, currentFolderId, editingFile]);

  const handleEdit = (file: FileNode) => {
    setEditingFile(file);
    form.setFieldsValue({
      name: file.name,
      type: file.type,
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    setFileSystem(prev => {
      const deleteRecursive = (itemId: string): FileNode[] => {
        return prev.filter(item => {
          if (item.id === itemId) return false;
          if (item.parentId === itemId) {
            return false;
          }
          return true;
        });
      };
      return deleteRecursive(id);
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>File Explorer</h1>
      <Space style={{ marginBottom: '20px' }}>
        <Button onClick={navigateUp} disabled={currentFolderId === 'root'}>
          Up
        </Button>
        <Button onClick={() => { setEditingFile(null); setIsModalVisible(true); }} type="primary">
          Add New
        </Button>
      </Space>
      <Breadcrumb style={{ marginBottom: '20px' }}>
        {breadcrumbItems.map((item, index) => (
          <Breadcrumb.Item key={item.id}>
            <a onClick={() => setCurrentFolderId(item.id)}>
              {index === 0 ? <HomeOutlined /> : null} {item.name}
            </a>
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>
      <Table 
        columns={columns} 
        dataSource={currentFolderContents}
        pagination={false}
        rowKey="id"
      />
      <Modal
        title={editingFile ? "Edit Item" : "Add New Item"}
        visible={isModalVisible}
        onOk={handleAddOrEdit}
        onCancel={() => { setIsModalVisible(false); setEditingFile(null); form.resetFields(); }}
      >
        <Form form={form} initialValues={{ type: 'File' }}>
          <Form.Item name="name" rules={[{ required: true, message: 'Please input the name!' }]}>
            <Input placeholder="Name" />
          </Form.Item>
          <Form.Item name="type" rules={[{ required: true, message: 'Please select the type!' }]}>
            <Select>
              <Select.Option value="File">File</Select.Option>
              <Select.Option value="Folder">Folder</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FileExplorer;