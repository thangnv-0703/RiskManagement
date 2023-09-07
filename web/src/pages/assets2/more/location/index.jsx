import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Button, message, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { DeleteIconAction, EditIconAction } from '@/components/TableAction';
import { getLocations, deleteLocation, createLocation, updateLocation } from './service';

const Location = () => {
  const [visibleModal, setVisibleModal] = useState(false);
  const [isAddLocation, setIsAddLocation] = useState(true);
  const [currentRow, setCurrentRow] = useState({});

  const actionRef = useRef();

  const handleVisibleModalEditAdd = (visible) => {
    setVisibleModal(visible);
    if (!visible) {
      setIsAddLocation(true);
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
      title: 'Address',
      dataIndex: 'address',
      width: '30%',
    },
    {
      title: 'Departments',
      dataIndex: 'num_of_departments',
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
            setIsAddLocation(false);
            setCurrentRow(record);
          }}
        />,
        <DeleteIconAction
          key="delete"
          onClick={() => {
            Modal.confirm({
              title: 'Delete location',
              content: 'Are you sure?',
              okText: 'Ok',
              cancelText: 'Cancel',
              onOk: async () => await handleDeleteLocation(record.id),
            });
          }}
        />,
      ],
    },
  ];

  const handleDeleteLocation = async (id) => {
    try {
      const success = await deleteLocation({ id });
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

  const handleAddEditLocation = async (values) => {
    const res = isAddLocation
      ? await createLocation(values)
      : await updateLocation({ id: currentRow.id, ...values });
    if (res) {
      message.success(`${isAddLocation ? 'Add' : 'Edit'} location successful!`);
      if (actionRef.current) {
        actionRef.current.reload();
      }
      setIsAddLocation(true);
      setCurrentRow({});
      return true;
    }
    message.error(`${isAddLocation ? 'Add' : 'Edit'} location failed!`);
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
          const data = await getLocations({ ...params });
          return {
            data,
            success: true,
          };
        }}
        columns={columnsTableList}
        pagination={{
          pageSize: 10,
        }}
        // headerTitle="Location Table"
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
        title={`${isAddLocation ? 'Add' : 'Edit'} location`}
        width="600px"
        visible={visibleModal}
        onVisibleChange={handleVisibleModalEditAdd}
        modalProps={{
          destroyOnClose: true,
        }}
        onFinish={handleAddEditLocation}
        initialValues={currentRow}
        layout={'vertical'}
      >
        <ProFormText
          label="Name"
          rules={[
            {
              required: true,
            },
          ]}
          name="name"
        />

        <ProFormText
          label="Address"
          rules={[
            {
              required: true,
            },
          ]}
          name="address"
        />
      </ModalForm>
    </PageContainer>
  );
};

export default Location;
