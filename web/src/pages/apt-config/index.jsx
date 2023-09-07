import { Affix, Button, Collapse, Typography, Card, message, Row, Col, Select, Input } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { NumericInput } from './components/numerical-input';
import React, { useEffect, useState } from 'react';
import { FactorList } from './components/factor-list';
import { getAptConfig, saveAptConfig } from './service';
import {
  AGGREGATE_FUNCTION,
  ATTACKER_CAPABILITY_FACTOR,
  EFFECTIVENESS_OF_DEFENDER_FACTOR,
} from '@/shared/constant';
const { Panel } = Collapse;

const AptConfig = () => {
  const [configs, setConfigs] = useState([]);
  const [defenderVariationRate, setDefenderVariationRate] = useState(0);
  const [attackerVariationRate, setAttackerVariationRate] = useState(0);

  useEffect(() => {
    getAptConfig().then((res) => {
      const resData = res?.data;
      resData.attacker_capability_default = resData?.attacker_capability_default?.map((factor) => ({
        ...factor,
        description: ATTACKER_CAPABILITY_FACTOR.find((f) => f.name === factor.name)?.description,
      }));

      resData.effectiveness_defender_default = resData?.effectiveness_defender_default?.map(
        (factor) => ({
          ...factor,
          description: EFFECTIVENESS_OF_DEFENDER_FACTOR.find((f) => f.name === factor.name)
            ?.description,
        }),
      );

      setDefenderVariationRate(resData?.defender_variation_rate?.toString());
      setAttackerVariationRate(resData?.attacker_variation_rate?.toString());
      setConfigs(resData);
    });
  }, []);

  const setDefaultFactor = (factors, key) => {
    const newConfig = { ...configs };
    newConfig[key] = factors;
    setConfigs(newConfig);
  };

  const handleClickSave = () => {
    if (configs?.defender_variation_rate === '' || configs?.attacker_variation_rate === '') {
      message.error('Please input variation rate');
      return;
    }
    if (
      configs?.defender_variation_rate < 0 ||
      configs?.defender_variation_rate > 1 ||
      configs?.attacker_variation_rate < 0 ||
      configs?.attacker_variation_rate > 1
    ) {
      message.error('Variation rate must be between 0 and 1');
      return;
    }
    saveAptConfig(configs)
      .then((res) => {
        message.success('Save done');
      })
      .catch((err) => {
        message.error('Save failed');
      });
  };

  return (
    <PageContainer
      style={{ height: 'calc(100vh - 72px)' }}
      header={{
        title: 'APT configuration',
      }}
    >
      <Card style={{ height: 'calc(100vh - 166px)' }}>
        <Collapse
          defaultActiveKey={['1', '2', '3']}
          style={{ height: 'calc(100vh - 276px)', overflow: 'auto' }}
        >
          <Panel header={'General setting default'} key="1">
            <Row gutter={20} style={{ marginBottom: 24 }}>
              <Col span={4}></Col>
              <Col span={6}>
                <b>Aggregate function</b>
              </Col>
              <Col span={6}>
                <b>Variation Rate </b>
              </Col>
            </Row>
            <Row gutter={20} style={{ marginBottom: 24 }}>
              <Col span={4}>
                <b>Attacker profile </b>
              </Col>
              <Col span={6}>
                <Select
                  value={configs?.attacker_aggregate_function}
                  style={{
                    width: 180,
                  }}
                  onChange={(value) =>
                    setConfigs({ ...configs, attacker_aggregate_function: value })
                  }
                >
                  {AGGREGATE_FUNCTION.map((item) => (
                    <Select.Option value={item.value} key={item.value}>
                      {item.display}
                    </Select.Option>
                  ))}
                </Select>
              </Col>
              <Col span={6}>
                {/* <Input
                  style={{
                    width: 180,
                  }}
                  onChange={(e) => {
                    const value = e.target.value;
                    setConfigs({ ...configs, defender_variation_rate: parseFloat(value) });
                    if (!isNaN(parseFloat(value))) {
                    }
                    // else if (value === '') {
                    //   setConfigs({ ...configs, defender_variation_rate: '' });
                    // }
                  }}
                  value={configs?.defender_variation_rate}
                /> */}
                <NumericInput
                  style={{
                    width: 180,
                  }}
                  value={attackerVariationRate}
                  onChange={(value) => {
                    setAttackerVariationRate(value);
                    setConfigs({ ...configs, attacker_variation_rate: parseFloat(value) });
                  }}
                />
              </Col>
            </Row>
            <Row gutter={20} style={{ marginBottom: 24 }}>
              <Col span={4}>
                <b>Defender profile </b>
              </Col>
              <Col span={6}>
                <Select
                  value={configs?.defender_aggregate_function}
                  style={{
                    width: 180,
                  }}
                  onChange={(value) =>
                    setConfigs({ ...configs, defender_aggregate_function: value })
                  }
                >
                  {AGGREGATE_FUNCTION.map((item) => (
                    <Select.Option value={item.value} key={item.value}>
                      {item.display}
                    </Select.Option>
                  ))}
                </Select>
              </Col>
              <Col span={6}>
                {/* <Input
                  style={{
                    width: 180,
                  }}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!isNaN(parseFloat(value))) {
                      setConfigs({ ...configs, attacker_variation_rate: parseFloat(value) });
                    } else if (value === '') {
                      setConfigs({ ...configs, attacker_variation_rate: '' });
                    }
                  }}
                  value={configs?.attacker_variation_rate}
                /> */}
                <NumericInput
                  style={{
                    width: 180,
                  }}
                  value={defenderVariationRate}
                  onChange={(value) => {
                    setDefenderVariationRate(value);
                    setConfigs({ ...configs, defender_variation_rate: parseFloat(value) });
                  }}
                />
              </Col>
            </Row>
          </Panel>
          <Panel header={'Attacker capability setting default'} key="2">
            <FactorList
              dataSource={configs?.attacker_capability_default}
              keyFactor="attacker_capability_default"
              changeDefaultFactor={setDefaultFactor}
            />
          </Panel>
          <Panel header={'Effectiveness of defender setting default'} key="3">
            <FactorList
              dataSource={configs?.effectiveness_defender_default}
              keyFactor="effectiveness_defender_default"
              changeDefaultFactor={setDefaultFactor}
            />
          </Panel>
        </Collapse>
        <Affix style={{ position: 'fixed', right: 50, bottom: 50, zIndex: 1000 }}>
          <Button type="primary" onClick={handleClickSave}>
            Save
          </Button>
        </Affix>
      </Card>
    </PageContainer>
  );
};

export default AptConfig;
