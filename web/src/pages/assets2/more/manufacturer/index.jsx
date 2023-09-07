import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Button, message, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { DeleteIconAction, EditIconAction } from '@/components/TableAction';
import {
  getManufacturers,
  deleteManufacturer,
  createManufacturer,
  updateManufacturer,
} from './service';

const Manufacturer = () => {
  const [visibleModal, setVisibleModal] = useState(false);
  const [isAddManufacturer, setIsAddManufacturer] = useState(true);
  const [currentRow, setCurrentRow] = useState({});

  const actionRef = useRef();

  const handleVisibleModalEditAdd = (visible) => {
    setVisibleModal(visible);
    if (!visible) {
      setIsAddManufacturer(true);
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
      title: 'Hardware Models',
      dataIndex: 'asset_models',
      width: '30%',
    },
    {
      title: 'Licenses',
      dataIndex: 'licenses',
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
            setIsAddManufacturer(false);
            setCurrentRow(record);
          }}
        />,
        <DeleteIconAction
          key="delete"
          onClick={() => {
            Modal.confirm({
              title: 'Delete manufacturer',
              content: 'Are you sure?',
              okText: 'Ok',
              cancelText: 'Cancel',
              onOk: async () => await handleDeleteManufacturer(record.id),
            });
          }}
        />,
      ],
    },
  ];

  const handleDeleteManufacturer = async (id) => {
    try {
      const success = await deleteManufacturer({ id });
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

  const handleAddEditManufacturer = async (values) => {
    const res = isAddManufacturer
      ? await createManufacturer(values)
      : await updateManufacturer({ id: currentRow.id, ...values });
    if (res) {
      message.success(`${isAddManufacturer ? 'Add' : 'Edit'} manufacturer successful!`);
      if (actionRef.current) {
        actionRef.current.reload();
      }
      setIsAddManufacturer(true);
      setCurrentRow({});
      return true;
    }
    message.error(`${isAddManufacturer ? 'Add' : 'Edit'} manufacturer failed!`);
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
          const data = await getManufacturers({ ...params });
          return {
            data,
            success: true,
          };
        }}
        columns={columnsTableList}
        pagination={{
          pageSize: 10,
        }}
        // headerTitle="Manufacturer Table"
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
        title={`${isAddManufacturer ? 'Add' : 'Edit'} manufacturer`}
        width="600px"
        visible={visibleModal}
        onVisibleChange={handleVisibleModalEditAdd}
        modalProps={{
          destroyOnClose: true,
        }}
        onFinish={handleAddEditManufacturer}
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
      </ModalForm>
    </PageContainer>
  );
};

export default Manufacturer;
