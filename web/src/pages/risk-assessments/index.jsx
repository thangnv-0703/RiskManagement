import IconAction, { DetailIconAction } from '@/components/TableAction';
import { history } from 'umi';
import {
  DownOutlined,
  EllipsisOutlined,
  FileProtectOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Button, Tag, Tooltip, Typography } from 'antd';
import React from 'react';
import { getDeploymentScenarioBySystemProfile } from './service';
import { getSystemProfiles } from '../system-profiles/list/service';
import {
  DEPLOYMENT_SCENARIO_DEPLOYMENTS,
  DEPLOYMENT_SCENARIO_REQUIREMENTS_ANALYSIS,
} from '@/shared/constant';

const { Paragraph } = Typography;

const ExpandedRowRender = ({ systemProfile }) => {
  const columns = [
    {
      title: 'Deployment scenario',
      dataIndex: 'name',
      key: 'name',
      width: '40%',
    },
    {
      title: 'Created at',
      dataIndex: 'created_at',
      key: 'created_at',
      valueType: 'date',
      width: '20%',
    },
    {
      title: 'Updated at',
      dataIndex: 'updated_at',
      key: 'updated_at',
      valueType: 'date',
      width: '20%',
    },
    {
      title: 'Stage',
      dataIndex: 'status',
      key: 'status',
      hideInForm: true,
      hideInSearch: true,
      width: '10%',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      valueType: 'option',
      width: '10%',
      render: (_, record) => [
        <IconAction
          key="assessment"
          onClick={() => {
            history.push(`/risk-assessments/assessments/${record.id}`);
          }}
          title="Risk assessment"
          icon={<FileProtectOutlined />}
        />,
        <DetailIconAction
          key="detail"
          onClick={() => {
            history.push(`/deployment-scenarios/${record.id}`);
          }}
        />,
      ],
    },
  ];
  return (
    <ProTable
      columns={columns}
      toolBarRender={false}
      request={async (params, sort, filter) => {
        return await getDeploymentScenarioBySystemProfile(systemProfile.id, {
          ...params,
          status: `${DEPLOYMENT_SCENARIO_DEPLOYMENTS},${DEPLOYMENT_SCENARIO_REQUIREMENTS_ANALYSIS}`,
        });
      }}
      pagination={{
        hideOnSinglePage: true,
      }}
      search={{
        labelWidth: 'auto',
      }}
      rowKey="id"
      bordered
    />
  );
};

const RiskAssessments = () => {
  const columns = [
    {
      title: 'System profile',
      width: '30%',
      dataIndex: 'name',
      render: (_) => <a>{_}</a>,
    },
    {
      title: 'Description',
      width: '40%',
      dataIndex: 'description',
      render: (_) => <Paragraph ellipsis={{ tooltip: _, rows: 3 }}>{_}</Paragraph>,
      // render: (_, record) => <Tag color={record.status.color}>{record.status.text}</Tag>,
    },
    {
      title: 'Created at',
      key: 'created_at',
      width: '15%',
      dataIndex: 'created_at',
      valueType: 'date',
      sorter: (a, b) => a.created_at - b.created_at,
    },
    {
      title: 'Updated at',
      key: 'updated_at',
      width: '15%',
      dataIndex: 'updated_at',
      valueType: 'date',
      sorter: (a, b) => a.created_at - b.created_at,
    },
  ];
  return (
    <PageContainer>
      <ProTable
        columns={columns}
        request={getSystemProfiles}
        rowKey="id"
        pagination={{
          showQuickJumper: true,
          hideOnSinglePage: true,
        }}
        expandable={{
          expandedRowRender: (record) => <ExpandedRowRender systemProfile={record} />,
        }}
        search={{
          labelWidth: 'auto',
        }}
        dateFormatter="string"
        // headerTitle="嵌套表格"
        options={false}
        bordered
      />
    </PageContainer>
  );
};
export default RiskAssessments;
