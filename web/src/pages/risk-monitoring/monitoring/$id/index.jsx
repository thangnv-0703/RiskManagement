import { PageContainer } from '@ant-design/pro-layout';
import { Card, Descriptions, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { getDeploymentScenario } from '@/pages/deployment-scenarios/service';
import { getSystemProfile } from '@/pages/system-profiles/$id/service';
import MonitoringForm from './monitor';
import {
  MonitorOutlined,
  RocketFilled,
  RocketOutlined,
  SettingOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import ScanVulnerability from './scan-vulnerability/$id';
import VulnerabilySettingMonitoring from './update/vulnerability-setting';
import AttackGraphMonitoring from './update/attack_graph';
import DetectThreat from './detect-threat';

const Monitoring = (props) => {
  const { id } = props?.match?.params;
  const [deploymentScenario, setDeploymentScenario] = useState({});
  const [systemProfile, setSystemProfile] = useState({});
  const [sync, setSync] = useState(true);

  const fetchData = async () => {
    const resDeploy = await getDeploymentScenario(id);
    setDeploymentScenario(resDeploy.data);
    if (resDeploy?.data) {
      const resSys = await getSystemProfile(resDeploy.data.system_profile_id);
      setSystemProfile(resSys.data);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <PageContainer
      style={{ height: 'calc(100vh - 72px)', overflow: 'hidden' }}
      header={{
        title: 'Risk monitoring',
      }}
      content={
        <Descriptions column={2} style={{ marginBottom: -16 }}>
          <Descriptions.Item label="System profile">
            <a onClick={() => {}}>{systemProfile.name}</a>
          </Descriptions.Item>
          <Descriptions.Item label="Deployment scenario">
            <a onClick={() => {}}>{deploymentScenario.name}</a>
          </Descriptions.Item>
        </Descriptions>
      }
    >
      <Card style={{ height: 'calc(100vh - 204px)' }}>
        <Tabs
          defaultActiveKey="1"
          destroyInactiveTabPane
          items={[
            {
              key: '1',
              label: (
                <span>
                  <MonitorOutlined />
                  Monitoring
                </span>
              ),
              children: (
                <MonitoringForm deployment_scenario_id={id} sync={sync} setSync={setSync} />
              ),
            },
            {
              key: '2',
              label: (
                <span>
                  <RocketOutlined />
                  Update CVE
                </span>
              ),
              children: (
                <VulnerabilySettingMonitoring
                  deployment_scenario_id={id}
                  sync={sync}
                  setSync={setSync}
                />
              ),
            },
            {
              key: '3',
              label: (
                <span>
                  <RocketOutlined />
                  Update attack graph
                </span>
              ),
              children: (
                <AttackGraphMonitoring deployment_scenario_id={id} sync={sync} setSync={setSync} />
              ),
            },
            {
              key: '4',
              label: (
                <span>
                  <SyncOutlined />
                  Scan vulnerability
                </span>
              ),
              children: (
                <ScanVulnerability deployment_scenario_id={id} sync={sync} setSync={setSync} />
              ),
            },
            {
              key: '5',
              label: (
                <span>
                  <SyncOutlined />
                  Detect threat
                </span>
              ),
              children: <DetectThreat deployment_scenario_id={id} />,
            },
          ]}
        ></Tabs>
      </Card>
    </PageContainer>
  );
};

export default Monitoring;
