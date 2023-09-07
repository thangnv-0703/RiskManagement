import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Button, message, Modal, Checkbox } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText, ProFormCheckbox, ProForm } from '@ant-design/pro-form';
import { DeleteIconAction, EditIconAction } from '@/components/TableAction';
import {
  getDigitalContents,
  deleteDigitalContent,
  createDigitalContent,
  updateDigitalContent,
} from './service';

const DigitalContent = () => {
  const [visibleModal, setVisibleModal] = useState(false);
  const [isAddDigitalContent, setIsAddDigitalContent] = useState(true);
  const [currentRow, setCurrentRow] = useState({});

  const actionRef = useRef();

  const handleVisibleModalEditAdd = (visible) => {
    setVisibleModal(visible);
    if (!visible) {
      setIsAddDigitalContent(true);
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
      valueType: 'link',
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
            setIsAddDigitalContent(false);
            setCurrentRow(record);
          }}
        />,
        <DeleteIconAction
          key="delete"
          onClick={() => {
            Modal.confirm({
              title: 'Delete digital content',
              content: 'Are you sure?',
              okText: 'Ok',
              cancelText: 'Cancel',
              onOk: async () => await handleDeleteDigitalContent(record.id),
            });
          }}
        />,
      ],
    },
  ];

  const handleDeleteDigitalContent = async (id) => {
    try {
      const success = await deleteDigitalContent({ id });
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

  const handleAddEditDigitalContent = async (values) => {
    const res = isAddDigitalContent
      ? await createDigitalContent(values)
      : await updateDigitalContent({ id: currentRow.id, ...values });
    if (res) {
      message.success(`${isAddDigitalContent ? 'Add' : 'Edit'} digital content successful!`);
      if (actionRef.current) {
        actionRef.current.reload();
      }
      setIsAddDigitalContent(true);
      setCurrentRow({});
      return true;
    }
    message.error(`${isAddDigitalContent ? 'Add' : 'Edit'} digital content failed!`);
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
          const data = await getDigitalContents({ ...params });
          return {
            data,
            success: true,
          };
        }}
        columns={columnsTableList}
        pagination={{
          pageSize: 10,
        }}
        // headerTitle="DigitalContent Table"
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
        title={`${isAddDigitalContent ? 'Add' : 'Edit'} digital content`}
        width="600px"
        visible={visibleModal}
        onVisibleChange={handleVisibleModalEditAdd}
        modalProps={{
          destroyOnClose: true,
        }}
        onFinish={handleAddEditDigitalContent}
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
        <ProFormText label="Description" name="description" />
        <ProForm.Group>
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
        </ProForm.Group>
      </ModalForm>
    </PageContainer>
  );
};

export default DigitalContent;
