import { PageContainer } from '@ant-design/pro-layout';
import { Card, Descriptions } from 'antd';
import { useEffect, useState } from 'react';
import MappingVul from '../../components/MappingVul';
import { getDeploymentScenario } from '../../service';

const Mapping = (props) => {
  const { id } = props?.match?.params;

  const [deploymentScenario, setDeploymentScenario] = useState({});

  const fetchData = async () => {
    const dataRes = await getDeploymentScenario(id);
    if (dataRes) {
      setDeploymentScenario(dataRes.data);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <PageContainer
      header={{
        title: 'Mapping Asset to CVE',
      }}
      content={
        <Descriptions column={2} style={{ marginBottom: -16 }}>
          <Descriptions.Item label="Deployment scenario">
            <a onClick={() => {}}>{deploymentScenario.name}</a>
          </Descriptions.Item>
        </Descriptions>
      }
    >
      <Card>
        <MappingVul deploymentScenario={deploymentScenario} />
      </Card>
    </PageContainer>
  );
};

export default Mapping;
