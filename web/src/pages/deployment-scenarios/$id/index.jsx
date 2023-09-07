import { DetailIconAction } from '@/components/TableAction';
import { getHistoryAssessmentDeploymentScenario } from '@/pages/risk-assessments/service';
import { getSystemProfile } from '@/pages/system-profiles/$id/service';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Button, Card, Col, Descriptions, Modal, Row, Space, Tabs } from 'antd';
import { useState } from 'react';
import { useEffect } from 'react';
import { getDeploymentScenario } from '../service';
import { history } from 'umi';
import { riskLevelToColor } from '@/shared/common';
import { DEPLOYMENT_SCENARIO_REQUIREMENTS_ANALYSIS } from '@/shared/constant';
import RiskRatingBreakdownPie from './components/RiskRating';
import RiskHeatMap from './components/RiskHeadMap';
import IntroduceRowDeploymentScenarioDetail from './components/IntroduceRow';
import TopVulnerability from './components/TopVulnerability';
import TopAsset from './components/TopAsset';
import TopRiskAssessment from './components/TopRiskAssessment';
import RiskAssessmentComparison from './components/RiskAssessmentComparison';
import { convertAssetType } from '@/shared/common';

const { TabPane } = Tabs;

const DeploymentScenarioDetail = (props) => {
  const { id } = props?.match?.params;
  const [deploymentScenario, setDeploymentScenario] = useState({});
  const [systemProfile, setSystemProfile] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [visiableComparison, setVisiableComparison] = useState(false);
  const [assessmentResults, setAssessmentResults] = useState([]);
  const fetchData = async () => {
    const res = await getDeploymentScenario(id);
    setDeploymentScenario(res.data);
    if (res.data) {
      const resSys = await getSystemProfile(res.data.system_profile_id);
      setSystemProfile(resSys.data);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const secutrityColumn = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: '20%',
    },
    {
      title: 'Asset',
      dataIndex: 'asset_id',
      key: 'asset_id',
      width: '15%',
      render: (_, record) => (
        <div>{deploymentScenario.assets?.find((asset) => asset.id === record.asset_id).name}</div>
      ),
    },
    {
      title: 'Confidentiality',
      dataIndex: 'confidentiality',
      key: 'confidentiality',
      width: '15%',
    },
    {
      title: 'Availability',
      dataIndex: 'availability',
      key: 'availability',
      width: '15%',
    },
    {
      title: 'Integrity',
      dataIndex: 'integrity',
      key: 'integrity',
      width: '15%',
    },
  ];

  const assetColumn = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'CPE',
      dataIndex: 'cpe',
      key: 'cpe',
      width: '40%',
    },
    {
      title: 'Type',
      dataIndex: 'part',
      key: 'part',
      width: '10%',
      render: (_) => convertAssetType(_),
    },
    {
      title: 'Vendor',
      dataIndex: 'vendor',
      key: 'vendor',
      width: '20%',
    },
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
      width: '20%',
    },
    {
      title: 'Version',
      dataIndex: 'version',
      key: 'version',
      width: '10%',
    },
  ];

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
    },
    {
      title: 'Risk',
      hideInForm: true,
      hideInSearch: true,
      children: [
        {
          title: 'With countermeasures',
          dataIndex: 'i_r',
          key: 'i_r',
          align: 'center',
          render: (_, record) => {
            const riskLevel = record?.result?.risk?.risk_level?.countermeasures[0];
            return <b style={{ color: riskLevelToColor(riskLevel) }}>{riskLevel}</b>;
          },
          width: '20%',
        },
        {
          title: 'Not implemented',
          dataIndex: 'n_r',
          key: 'n_r',
          align: 'center',
          render: (_, record) => {
            const riskLevel = record?.result?.risk?.risk_level?.not_countermeasures[0];
            return <b style={{ color: riskLevelToColor(riskLevel) }}>{riskLevel}</b>;
          },
          width: '20%',
        },
      ],
    },
    {
      title: 'Created at',
      dataIndex: 'created_at',
      key: 'created_at',
      hideInForm: true,
      hideInSearch: true,
      valueType: 'date',
      align: 'center',
      width: '15%',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      hideInForm: true,
      hideInSearch: true,
      align: 'center',
      width: '15%',
      render: (_, record) => (
        <DetailIconAction
          title="Detail assessment"
          onClick={() => {
            history.push(`/risk-assessments/${record.id}`);
          }}
        />
      ),
    },
  ];
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  return (
    <PageContainer
      header={{
        title: 'Deployment scenario detail',
      }}
      content={
        <Descriptions column={2} style={{ marginBottom: -16 }}>
          <Descriptions.Item label="Name">
            <a onClick={() => {}}>{deploymentScenario.name}</a>
          </Descriptions.Item>
          <Descriptions.Item label="System profile">
            <a
              onClick={() => {
                history.push(`/system-profiles/${systemProfile.id}`);
              }}
            >
              {systemProfile.name}
            </a>
          </Descriptions.Item>
          <Descriptions.Item label="Description">
            {deploymentScenario.description}
          </Descriptions.Item>
          <Descriptions.Item label="Stage">{deploymentScenario.status}</Descriptions.Item>
        </Descriptions>
      }
    >
      <Row gutter={20} style={{ marginBottom: 20 }}>
        <Col span={24}>
          <Card title="Security goals - Assets">
            <Row gutter={20}>
              <Col span={12} style={{ padding: '20px' }}>
                <ProTable
                  dataSource={deploymentScenario?.security_goals}
                  pagination={{
                    hideOnSinglePage: true,
                  }}
                  search={false}
                  columns={secutrityColumn}
                  bordered
                  toolBarRender={false}
                  rowKey="created_at"
                />
              </Col>
              <Col span={12} style={{ padding: '20px' }}>
                <ProTable
                  dataSource={deploymentScenario?.assets}
                  pagination={{
                    hideOnSinglePage: true,
                  }}
                  search={false}
                  columns={assetColumn}
                  bordered
                  toolBarRender={false}
                  rowKey="created_at"
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <Row gutter={20}>
        <Col span={24}>
          {/* {deploymentScenario?.status === DEPLOYMENT_SCENARIO_REQUIREMENTS_ANALYSIS ? ( */}
          <Card title="Risk assessment history">
            <Button
              type="primary"
              disabled={selectedRowKeys.length <= 1}
              style={{ marginBottom: '12px' }}
              onClick={() => setVisiableComparison(true)}
            >
              Compare
            </Button>
            <ProTable
              rowSelection={{
                selectedRowKeys: selectedRowKeys,
                onChange: onSelectChange,
                columnTitle: <></>,
              }}
              request={async (params) => {
                const result = await getHistoryAssessmentDeploymentScenario(id, params);
                setAssessmentResults(result.data);
                return result;
              }}
              pagination={{
                hideOnSinglePage: true,
              }}
              search={false}
              columns={columns}
              bordered
              toolBarRender={false}
              rowKey="created_at"
            />
          </Card>
        </Col>
      </Row>
      <Modal
        title="Risk assessment result comparison"
        wrapClassName="modal-fullscreen"
        open={visiableComparison}
        onFinish={() => setVisiableComparison(false)}
        onVisibleChange={() => setVisiableComparison(false)}
        // onCancel={() => setVisiableComparison(false)}
        // cancelText="Close"
        modalProps={{
          destroyOnClose: true,
        }}
        footer={[
          <Button key="submit" type="primary" onClick={() => setVisiableComparison(false)}>
            Close
          </Button>,
        ]}
      >
        <RiskAssessmentComparison assessmentResults={assessmentResults} />
      </Modal>
    </PageContainer>
  );
};

export default DeploymentScenarioDetail;
