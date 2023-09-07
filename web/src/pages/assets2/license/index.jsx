import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Button, message, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormDatePicker, ProFormText, ProFormSelect } from '@ant-design/pro-form';
import { DeleteIconAction, EditIconAction } from '@/components/TableAction';
import { getLicenses, deleteLicense, createLicense, updateLicense } from './service';
import { getCategories } from '../more/category/service';
import { getManufacturers } from '../more/manufacturer/service';
import { getSuppliers } from '../more/supplier/service';
import { convertDatetimeISO } from '@/shared/common';

const License = () => {
  const [visibleModal, setVisibleModal] = useState(false);
  const [isAddLicense, setIsAddLicense] = useState(true);
  const [currentRow, setCurrentRow] = useState({});

  const actionRef = useRef();

  const handleVisibleModalEditAdd = (visible) => {
    setVisibleModal(visible);
    if (!visible) {
      setIsAddLicense(true);
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
      title: 'Key',
      dataIndex: 'key',
    },
    {
      title: 'Purchase cost',
      dataIndex: 'purchase_cost',
    },
    {
      title: 'Purchase date',
      dataIndex: 'purchase_date',
      render: (date) => convertDatetimeISO(date),
    },
    {
      title: 'Expiration date',
      dataIndex: 'expiration_date',
      render: (date) => convertDatetimeISO(date),
    },
    {
      title: 'Seats',
      dataIndex: 'seats',
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
      title: 'Supplier',
      dataIndex: 'supplier',
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
            setIsAddLicense(false);
            setCurrentRow(record);
          }}
        />,
        <DeleteIconAction
          key="delete"
          onClick={() => {
            Modal.confirm({
              title: 'Delete license',
              content: 'Are you sure?',
              okText: 'Ok',
              cancelText: 'Cancel',
              onOk: async () => await handleDeleteLicense(record.id),
            });
          }}
        />,
      ],
    },
  ];

  const handleDeleteLicense = async (id) => {
    try {
      const success = await deleteLicense({ id });
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

  const handleAddEditLicense = async (values) => {
    const res = isAddLicense
      ? await createLicense(values)
      : await updateLicense({ id: currentRow.id, ...values });
    if (res) {
      message.success(`${isAddLicense ? 'Add' : 'Edit'} license successful!`);
      if (actionRef.current) {
        actionRef.current.reload();
      }
      setIsAddLicense(true);
      setCurrentRow({});
      return true;
    }
    message.error(`${isAddLicense ? 'Add' : 'Edit'} license failed!`);
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
          const data = await getLicenses({ ...params });
          return {
            data,
            success: true,
          };
        }}
        columns={columnsTableList}
        pagination={{
          pageSize: 10,
        }}
        // headerTitle="License Table"
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
        title={`${isAddLicense ? 'Add' : 'Edit'} license`}
        width="600px"
        visible={visibleModal}
        onVisibleChange={handleVisibleModalEditAdd}
        modalProps={{
          destroyOnClose: true,
        }}
        onFinish={handleAddEditLicense}
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
          label="Key"
          rules={[
            {
              required: true,
              message: 'Please enter a key',
            },
          ]}
          name="key"
        />
        <ProFormText
          label="Purchase cost"
          rules={[
            {
              required: true,
              message: 'Please enter the purchase code',
            },
          ]}
          name="purchase_cost"
        />
        <ProFormDatePicker
          label="Purchase date"
          rules={[
            {
              required: true,
              message: 'Please enter the purchase date',
            },
          ]}
          name="purchase_date"
        />
        <ProFormDatePicker
          label="Expiration date"
          rules={[
            {
              required: true,
              message: 'Please enter the expiration date',
            },
          ]}
          name="expiration_date"
        />
        <ProFormText
          label="Number of seats"
          rules={[
            {
              required: true,
              message: 'Please enter the number of seats',
            },
          ]}
          name="seats"
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
        <ProFormSelect
          label="Supplier"
          rules={[
            {
              required: true,
              message: 'Please select a supplier!',
            },
          ]}
          name="supplierId"
          request={async () => {
            const suppliers = await getSuppliers();
            return suppliers.map((supplier) => ({
              label: supplier.name,
              value: supplier.id,
            }));
          }}
          placeholder="Please select a supplier"
        />
      </ModalForm>
    </PageContainer>
  );
};

export default License;
