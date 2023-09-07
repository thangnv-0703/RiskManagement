import { Card, Col, Radio, Row, Select, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from '../style.less';
import { Column } from '@ant-design/charts';
import PieChart from '@/components/Dashboard/Analytic/Piechart';
const { Text } = Typography;

const Proportion = ({ deploymentScenario, loading, data, results }) => {
  const [deploymentScenarioId, setDeploymentScenarioId] = useState(null);
  const config = {
    data: data[deploymentScenarioId] || [],
    xField: 'asset_name',
    yField: 'value',
    // isStack: true,
    seriesField: 'type',
    isGroup: true,
    columnStyle: {
      radius: [20, 20, 0, 0],
    },
  };

  useEffect(() => {
    setDeploymentScenarioId(deploymentScenario[0]?.id);
  }, [deploymentScenario.length]);

  return (
    <Card
      loading={loading}
      bordered={false}
      title="Vulnerability on deployment scenario"
      style={{
        height: '100%',
      }}
    >
      <Row
        gutter={24}
        style={{
          margin: '24px 0',
        }}
        justify="space-around"
        align="middle"
      >
        <Col span={14}>
          <b>Deployment scenario</b>
          <Select
            value={deploymentScenarioId}
            onChange={(value) => setDeploymentScenarioId(value)}
            style={{
              width: 300,
              marginLeft: 24,
            }}
          >
            {deploymentScenario.map((item) => (
              <Select.Option value={item.id} key={item.id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col span={10}>
          <b>Risk assessment results</b>
        </Col>
      </Row>
      <Row gutter={12}>
        <Col span={12} style={{ padding: '20px 60px' }}>
          <Column {...config} />
        </Col>
        <Col span={12} style={{ padding: '20px 60px' }}>
          <PieChart items={results} valueType={'riskLevel'} />
        </Col>
      </Row>
    </Card>
  );
};

export default Proportion;
