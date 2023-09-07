import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Button, message, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText, ProFormColorPicker } from '@ant-design/pro-form';
import { DeleteIconAction, EditIconAction } from '@/components/TableAction';
import { getStatuses, deleteStatus, createStatus, updateStatus } from './service';

const Status = () => {
  const [visibleModal, setVisibleModal] = useState(false);
  const [isAddStatus, setIsAddStatus] = useState(true);
  const [currentRow, setCurrentRow] = useState({});

  const actionRef = useRef();

  const handleVisibleModalEditAdd = (visible) => {
    setVisibleModal(visible);
    if (!visible) {
      setIsAddStatus(true);
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
      title: 'Color',
      dataIndex: 'color',
      width: '30%',
      render: (text) => (
        <div
          style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: text }}
        />
      ),
    },
    {
      title: 'Assets',
      dataIndex: 'num_of_assets',
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
            setIsAddStatus(false);
            setCurrentRow(record);
          }}
        />,
        <DeleteIconAction
          key="delete"
          onClick={() => {
            Modal.confirm({
              title: 'Delete status',
              content: 'Are you sure?',
              okText: 'Ok',
              cancelText: 'Cancel',
              onOk: async () => await handleDeleteStatus(record.id),
            });
          }}
        />,
      ],
    },
  ];

  const handleDeleteStatus = async (id) => {
    try {
      const success = await deleteStatus({ id });
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

  const handleAddEditStatus = async (values) => {
    const res = isAddStatus
      ? await createStatus(values)
      : await updateStatus({ id: currentRow.id, ...values });
    if (res) {
      message.success(`${isAddStatus ? 'Add' : 'Edit'} status successful!`);
      if (actionRef.current) {
        actionRef.current.reload();
      }
      setIsAddStatus(true);
      setCurrentRow({});
      return true;
    }
    message.error(`${isAddStatus ? 'Add' : 'Edit'} status failed!`);
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
          const data = await getStatuses({ ...params });
          return {
            data,
            success: true,
          };
        }}
        columns={columnsTableList}
        pagination={{
          pageSize: 10,
        }}
        // headerTitle="Status Table"
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
        title={`${isAddStatus ? 'Add' : 'Edit'} status`}
        width="600px"
        visible={visibleModal}
        onVisibleChange={handleVisibleModalEditAdd}
        modalProps={{
          destroyOnClose: true,
        }}
        onFinish={handleAddEditStatus}
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
        <ProFormColorPicker
          label="Color"
          rules={[
            {
              required: true,
              message: 'Please choose a color',
            },
          ]}
          name="color"
        />
      </ModalForm>
    </PageContainer>
  );
};

export default Status;
