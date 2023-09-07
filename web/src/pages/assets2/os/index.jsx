import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Button, message, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { DeleteIconAction, EditIconAction } from '@/components/TableAction';
import { getOSes, deleteOS, createOS, updateOS } from './service';

const OS = () => {
  const [visibleModal, setVisibleModal] = useState(false);
  const [isAddOS, setIsAddOS] = useState(true);
  const [currentRow, setCurrentRow] = useState({});

  const actionRef = useRef();

  const handleVisibleModalEditAdd = (visible) => {
    setVisibleModal(visible);
    if (!visible) {
      setIsAddOS(true);
      setCurrentRow({});
    }
  };

  const columnsTableList = [
    {
      title: 'Name',
      dataIndex: 'name',
      width: '20%',
      sorter: true,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      width: '16%',
    },
    {
      title: 'Version',
      dataIndex: 'version',
      width: '16%',
    },
    {
      title: 'Deployment Scenario',
      dataIndex: 'deployment_scenarios',
      width: '16%',
      render: (data) => {
        return data.length != 0 ? (
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {data.map((item) => (
              <li>
                <a href={`${window.location.origin}/deployment-scenarios/mapping/${item.id}`}>
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          'N/A'
        );
      },
    },
    {
      title: 'Top CVEs on Asset',
      dataIndex: 'cves',
      width: '16%',
      render: (data) => {
        if (data.length === 0) return 'N/A';
        else {
          const displayData = data.slice(0, Math.min(data.length, 3));
          return (
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {displayData.map((item) => (
                <li>{item.cve_id}</li>
              ))}
            </ul>
          );
        }
      },
    },
    {
      title: 'Action',
      dataIndex: 'option',
      valueType: 'option',
      width: '16%',
      render: (_, record) => [
        <EditIconAction
          key="edit"
          onClick={() => {
            setVisibleModal(true);
            setIsAddOS(false);
            setCurrentRow(record);
          }}
        />,
        <DeleteIconAction
          key="delete"
          onClick={() => {
            Modal.confirm({
              title: 'Delete operation system',
              content: 'Are you sure?',
              okText: 'Ok',
              cancelText: 'Cancel',
              onOk: async () => await handleDeleteOS(record.id),
            });
          }}
        />,
      ],
    },
  ];

  const handleDeleteOS = async (id) => {
    try {
      const success = await deleteOS({ id });
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

  const handleAddEditOS = async (values) => {
    const res = isAddOS ? await createOS(values) : await updateOS({ id: currentRow.id, ...values });
    if (res) {
      message.success(`${isAddOS ? 'Add' : 'Edit'} operation system successful!`);
      if (actionRef.current) {
        actionRef.current.reload();
      }
      setIsAddOS(true);
      setCurrentRow({});
      return true;
    }
    message.error(`${isAddOS ? 'Add' : 'Edit'} operation system failed!`);
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
          const data = await getOSes({ ...params });
          return {
            data,
            success: true,
          };
        }}
        columns={columnsTableList}
        pagination={{
          pageSize: 10,
        }}
        // headerTitle="OS Table"
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
        title={`${isAddOS ? 'Add' : 'Edit'} operation system`}
        width="600px"
        visible={visibleModal}
        onVisibleChange={handleVisibleModalEditAdd}
        modalProps={{
          destroyOnClose: true,
        }}
        onFinish={handleAddEditOS}
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
        <ProFormText label="Description" name="description" />
        <ProFormText
          label="Version"
          rules={[
            {
              required: true,
              message: 'Please enter a version',
            },
          ]}
          name="version"
        />
      </ModalForm>
    </PageContainer>
  );
};

export default OS;
