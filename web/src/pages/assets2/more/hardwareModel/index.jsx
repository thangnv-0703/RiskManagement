import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Button, message, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText, ProFormSelect } from '@ant-design/pro-form';
import { DeleteIconAction, EditIconAction } from '@/components/TableAction';
import {
  getHardwareModels,
  deleteHardwareModel,
  createHardwareModel,
  updateHardwareModel,
} from './service';
import { getCategories } from '../category/service';
import { getManufacturers } from '../manufacturer/service';

const HardwareModel = () => {
  const [visibleModal, setVisibleModal] = useState(false);
  const [isAddHardwareModel, setIsAddHardwareModel] = useState(true);
  const [currentRow, setCurrentRow] = useState({});

  const actionRef = useRef();

  const handleVisibleModalEditAdd = (visible) => {
    setVisibleModal(visible);
    if (!visible) {
      setIsAddHardwareModel(true);
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
      title: 'CPE',
      dataIndex: 'cpe',
    },
    {
      title: 'Assets',
      dataIndex: 'num_of_assets',
    },
    {
      title: 'Category',
      dataIndex: 'category',
    },
    {
      title: 'Manufacturer',
      dataIndex: 'manufacturer',
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
            setIsAddHardwareModel(false);
            setCurrentRow(record);
          }}
        />,
        <DeleteIconAction
          key="delete"
          onClick={() => {
            Modal.confirm({
              title: 'Delete hardware model',
              content: 'Are you sure?',
              okText: 'Ok',
              cancelText: 'Cancel',
              onOk: async () => await handleDeleteHardwareModel(record.id),
            });
          }}
        />,
      ],
    },
  ];

  const handleDeleteHardwareModel = async (id) => {
    try {
      const success = await deleteHardwareModel({ id });
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

  const handleAddEditHardwareModel = async (values) => {
    const res = isAddHardwareModel
      ? await createHardwareModel(values)
      : await updateHardwareModel({ id: currentRow.id, ...values });
    if (res) {
      message.success(`${isAddHardwareModel ? 'Add' : 'Edit'} hardware model successful!`);
      if (actionRef.current) {
        actionRef.current.reload();
      }
      setIsAddHardwareModel(true);
      setCurrentRow({});
      return true;
    }
    message.error(`${isAddHardwareModel ? 'Add' : 'Edit'} hardware model failed!`);
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
          const data = await getHardwareModels({ ...params });
          return {
            data,
            success: true,
          };
        }}
        columns={columnsTableList}
        pagination={{
          pageSize: 10,
        }}
        // headerTitle="HardwareModel Table"
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
        title={`${isAddHardwareModel ? 'Add' : 'Edit'} hardware model`}
        width="600px"
        visible={visibleModal}
        onVisibleChange={handleVisibleModalEditAdd}
        modalProps={{
          destroyOnClose: true,
        }}
        onFinish={handleAddEditHardwareModel}
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
        <ProFormSelect
          label="Manufacturer"
          rules={[
            {
              required: true,
              message: 'Please select a manufacturer!',
            },
          ]}
          name="manufacturerId"
          request={async () => {
            const manufacturers = await getManufacturers();
            return manufacturers.map((manufacturer) => ({
              label: manufacturer.name,
              value: manufacturer.id,
            }));
          }}
          placeholder="Please select a manufacturer"
        />
      </ModalForm>
    </PageContainer>
  );
};

export default HardwareModel;
