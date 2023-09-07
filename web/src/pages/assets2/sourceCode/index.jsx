import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Button, message, Modal, Checkbox } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProFormText,
  ProFormTextArea,
  ProForm,
  ProFormCheckbox,
} from '@ant-design/pro-form';
import { DeleteIconAction, EditIconAction } from '@/components/TableAction';
import { getSourceCodes, deleteSourceCode, createSourceCode, updateSourceCode } from './service';

const SourceCode = () => {
  const [visibleModal, setVisibleModal] = useState(false);
  const [isAddSourceCode, setIsAddSourceCode] = useState(true);
  const [currentRow, setCurrentRow] = useState({});

  const actionRef = useRef();

  const handleVisibleModalEditAdd = (visible) => {
    setVisibleModal(visible);
    if (!visible) {
      setIsAddSourceCode(true);
      setCurrentRow({});
    }
  };

  const columnsTableList = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: true,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Owner',
      dataIndex: 'owner',
    },
    {
      title: 'Description',
      dataIndex: 'description',
    },
    {
      title: 'Private',
      dataIndex: 'is_private',
      render: (text) => <Checkbox checked={text} />,
    },
    {
      title: 'URL',
      dataIndex: 'url',
      render: (_, record) => (
        <a href={record.url} target="_blank" rel="noopener noreferrer">
          {record.url}
        </a>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <EditIconAction
          key="edit"
          onClick={() => {
            setVisibleModal(true);
            setIsAddSourceCode(false);
            setCurrentRow(record);
          }}
        />,
        <DeleteIconAction
          key="delete"
          onClick={() => {
            Modal.confirm({
              title: 'Delete source code',
              content: 'Are you sure?',
              okText: 'Ok',
              cancelText: 'Cancel',
              onOk: async () => await handleDeleteSourceCode(record.id),
            });
          }}
        />,
      ],
    },
  ];

  const handleDeleteSourceCode = async (id) => {
    try {
      const success = await deleteSourceCode({ id });
      if (success) {
        message.success('Delete successful!');
        if (actionRef.current) {
          actionRef.current.reload();
        }
      }
    } catch {
      message.error('Delete failed!');
    }
  };

  const handleAddEditSourceCode = async (values) => {
    const res = isAddSourceCode
      ? await createSourceCode(values)
      : await updateSourceCode({ id: currentRow.id, ...values });
    if (res) {
      message.success(`${isAddSourceCode ? 'Add' : 'Edit'} source code successful!`);
      if (actionRef.current) {
        actionRef.current.reload();
      }
      setIsAddSourceCode(true);
      setCurrentRow({});
      return true;
    }
    message.error(`${isAddSourceCode ? 'Add' : 'Edit'} source code failed!`);
    return false;
  };

  return (
    <PageContainer>
      <ProTable
        actionRef={actionRef}
        rowKey="id"
        // search={{
        //   labelWidth: 120,
        // }}
        search={false}
        request={async (params) => {
          const data = await getSourceCodes({ ...params });
          return {
            data,
            success: true,
          };
        }}
        columns={columnsTableList}
        pagination={{
          pageSize: 10,
        }}
        // headerTitle="SourceCode Table"
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setVisibleModal(true);
            }}
          >
            <PlusOutlined /> Add
          </Button>,
        ]}
        bordered
      />
      <ModalForm
        title={`${isAddSourceCode ? 'Add' : 'Edit'} source code`}
        width="600px"
        visible={visibleModal}
        onVisibleChange={handleVisibleModalEditAdd}
        modalProps={{
          destroyOnClose: true,
        }}
        onFinish={handleAddEditSourceCode}
        initialValues={currentRow}
        layout={'vertical'}
      >
        <ProFormText
          label="Name"
          rules={[
            {
              required: true,
              message: 'Please enter a name',
            },
          ]}
          name="name"
        />

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ flexBasis: '45%' }}>
            <ProFormText
              label="Owner"
              rules={[
                {
                  required: true,
                  message: 'Please enter the name of owner',
                },
              ]}
              name="owner"
            />
          </div>
          <div style={{ flexBasis: '45%' }}>
            <ProFormText
              label="URL"
              rules={[
                {
                  required: true,
                  message: 'Please enter a URL',
                },
              ]}
              name="url"
            />
          </div>
        </div>
        <ProFormCheckbox
          label="Private"
          name="is_private"
          rules={[
            {
              required: true,
              message: 'Please check private or not',
            },
          ]}
        />
        <ProFormTextArea label="Description" name="description" />
      </ModalForm>
    </PageContainer>
  );
};

export default SourceCode;
