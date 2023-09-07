import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Button, message, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText, ProFormSelect, ProField } from '@ant-design/pro-form';
import { DeleteIconAction, EditIconAction } from '@/components/TableAction';
import { getDepartments, createDepartment, deleteDepartment, updateDepartment } from './service';
import { getLocations } from '../location/service';

const Department = () => {
  const [visibleModal, setVisibleModal] = useState(false);
  const [isAddDepartment, setIsAddDepartment] = useState(true);
  const [currentRow, setCurrentRow] = useState({});

  const actionRef = useRef();

  const handleVisibleModalEditAdd = (visible) => {
    setVisibleModal(visible);
    if (!visible) {
      setIsAddDepartment(true);
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
      title: 'Location',
      dataIndex: 'location',
      width: '30%',
    },
    {
      title: 'Assets',
      dataIndex: 'assets',
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
            setIsAddDepartment(false);
            setCurrentRow(record);
          }}
        />,
        <DeleteIconAction
          key="delete"
          onClick={() => {
            Modal.confirm({
              title: 'Delete department',
              content: 'Are you sure?',
              okText: 'Ok',
              cancelText: 'Cancel',
              onOk: async () => await handleDeleteDepartment(record.id),
            });
          }}
        />,
      ],
    },
  ];

  const handleDeleteDepartment = async (id) => {
    try {
      const success = await deleteDepartment({ id });
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

  const handleAddEditDepartment = async (values) => {
    // console.log(values);
    const res = isAddDepartment
      ? await createDepartment(values)
      : await updateDepartment({ id: currentRow.id, ...values });
    if (res) {
      message.success(`${isAddDepartment ? 'Add' : 'Edit'} department successful!`);
      if (actionRef.current) {
        actionRef.current.reload();
      }
      setIsAddDepartment(true);
      setCurrentRow({});
      return true;
    }
    message.error(`${isAddDepartment ? 'Add' : 'Edit'} department failed!`);
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
          const data = await getDepartments({ ...params });
          return {
            data,
            success: true,
          };
        }}
        columns={columnsTableList}
        pagination={{
          pageSize: 10,
        }}
        // headerTitle="Department Table"
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
        title={`${isAddDepartment ? 'Add' : 'Edit'} department`}
        width="600px"
        visible={visibleModal}
        onVisibleChange={handleVisibleModalEditAdd}
        modalProps={{
          destroyOnClose: true,
        }}
        onFinish={handleAddEditDepartment}
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

        <ProFormSelect
          label="Location"
          rules={[
            {
              required: true,
              message: 'Please select a location!',
            },
          ]}
          name="locationId"
          request={async () => {
            const locations = await getLocations();
            return locations.map((location) => ({
              label: location.name,
              value: location.id,
            }));
          }}
          placeholder="Please select a location"
          dropdownStyle={{
            maxHeight: '200px',
            overflowY: 'auto',
          }}
        />
      </ModalForm>
    </PageContainer>
  );
};

export default Department;
