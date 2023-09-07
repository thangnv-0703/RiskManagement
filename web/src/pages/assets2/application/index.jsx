import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Button, message, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { DeleteIconAction, EditIconAction } from '@/components/TableAction';
import {
  getApplications,
  deleteApplication,
  createApplication,
  updateApplication,
} from './service';

const Application = () => {
  const [visibleModal, setVisibleModal] = useState(false);
  const [isAddApplication, setIsAddApplication] = useState(true);
  const [currentRow, setCurrentRow] = useState({});

  const actionRef = useRef();

  const handleVisibleModalEditAdd = (visible) => {
    setVisibleModal(visible);
    if (!visible) {
      setIsAddApplication(true);
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
            setIsAddApplication(false);
            setCurrentRow(record);
          }}
        />,
        <DeleteIconAction
          key="delete"
          onClick={() => {
            Modal.confirm({
              title: 'Delete application',
              content: 'Are you sure?',
              okText: 'Ok',
              cancelText: 'Cancel',
              onOk: async () => await handleDeleteApplication(record.id),
            });
          }}
        />,
      ],
    },
  ];

  const handleDeleteApplication = async (id) => {
    try {
      const success = await deleteApplication({ id });
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

  const handleAddEditApplication = async (values) => {
    const res = isAddApplication
      ? await createApplication(values)
      : await updateApplication({ id: currentRow.id, ...values });
    if (res) {
      message.success(`${isAddApplication ? 'Add' : 'Edit'} application successful!`);
      if (actionRef.current) {
        actionRef.current.reload();
      }
      setIsAddApplication(true);
      setCurrentRow({});
      return true;
    }
    message.error(`${isAddApplication ? 'Add' : 'Edit'} application failed!`);
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
          const data = await getApplications({ ...params });
          return {
            data,
            success: true,
          };
        }}
        columns={columnsTableList}
        pagination={{
          pageSize: 10,
        }}
        // headerTitle="Application Table"
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
        title={`${isAddApplication ? 'Add' : 'Edit'} application`}
        width="600px"
        visible={visibleModal}
        onVisibleChange={handleVisibleModalEditAdd}
        modalProps={{
          destroyOnClose: true,
        }}
        onFinish={handleAddEditApplication}
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

export default Application;
