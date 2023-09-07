import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Button, message, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText, ProFormSelect } from '@ant-design/pro-form';
import { DeleteIconAction, EditIconAction } from '@/components/TableAction';
import {
  getDeprecations,
  deleteDeprecation,
  createDeprecation,
  updateDeprecation,
} from './service';
import { getCategories } from '../category/service';

const Deprecation = () => {
  const [visibleModal, setVisibleModal] = useState(false);
  const [isAddDeprecation, setIsAddDeprecation] = useState(true);
  const [currentRow, setCurrentRow] = useState({});

  const actionRef = useRef();

  const handleVisibleModalEditAdd = (visible) => {
    setVisibleModal(visible);
    if (!visible) {
      setIsAddDeprecation(true);
      setCurrentRow({});
    }
  };

  const columnsTableList = [
    {
      title: 'Name',
      dataIndex: 'name',
      width: '30%',
      sorter: true,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Term',
      dataIndex: 'months',
      width: '30%',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      width: '30%',
    },
    {
      title: 'Action',
      dataIndex: 'option',
      valueType: 'option',
      width: '10%',
      render: (_, record) => [
        <EditIconAction
          key="edit"
          onClick={() => {
            setVisibleModal(true);
            setIsAddDeprecation(false);
            setCurrentRow(record);
          }}
        />,
        <DeleteIconAction
          key="delete"
          onClick={() => {
            Modal.confirm({
              title: 'Delete deprecation',
              content: 'Are you sure?',
              okText: 'Ok',
              cancelText: 'Cancel',
              onOk: async () => await handleDeleteDeprecation(record.id),
            });
          }}
        />,
      ],
    },
  ];

  const handleDeleteDeprecation = async (id) => {
    try {
      const success = await deleteDeprecation({ id });
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

  const handleAddEditDeprecation = async (values) => {
    const res = isAddDeprecation
      ? await createDeprecation(values)
      : await updateDeprecation({ id: currentRow.id, ...values });
    if (res) {
      message.success(`${isAddDeprecation ? 'Add' : 'Edit'} deprecation successful!`);
      if (actionRef.current) {
        actionRef.current.reload();
      }
      setIsAddDeprecation(true);
      setCurrentRow({});
      return true;
    }
    message.error(`${isAddDeprecation ? 'Add' : 'Edit'} deprecation failed!`);
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
          const data = await getDeprecations({ ...params });
          return {
            data,
            success: true,
          };
        }}
        columns={columnsTableList}
        pagination={{
          pageSize: 10,
        }}
        // headerTitle="Deprecation Table"
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
        title={`${isAddDeprecation ? 'Add' : 'Edit'} deprecation`}
        width="600px"
        visible={visibleModal}
        onVisibleChange={handleVisibleModalEditAdd}
        modalProps={{
          destroyOnClose: true,
        }}
        onFinish={handleAddEditDeprecation}
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
          label="Term"
          rules={[
            {
              required: true,
              message: 'Please enter a term',
            },
          ]}
          name="name"
        />
        <ProFormSelect
          label="Category"
          rules={[
            {
              required: true,
              message: 'Please select a category!',
            },
          ]}
          name="categoryId"
          request={async () => {
            const categories = await getCategories();
            return categories.map((category) => ({
              label: category.name,
              value: category.id,
            }));
          }}
          placeholder="Please select a category"
        />
      </ModalForm>
    </PageContainer>
  );
};

export default Deprecation;
