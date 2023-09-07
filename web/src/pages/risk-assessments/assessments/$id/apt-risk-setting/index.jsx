import { Affix, Button, Collapse, Typography, Card, message, Row, Col, Select, Input } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useState } from 'react';
import { FactorList } from './components/factor-list';
import { getAptRiskSetting, saveAptRiskSetting } from '../service';
import {
  AGGREGATE_FUNCTION,
  ATTACKER_CAPABILITY_FACTOR,
  EFFECTIVENESS_OF_DEFENDER_FACTOR,
} from '@/shared/constant';
const { Panel } = Collapse;

const AptRiskSetting = (props) => {
  const { deployment_scenario_id } = props;
  const [configs, setConfigs] = useState([]);

  useEffect(() => {
    getAptRiskSetting(deployment_scenario_id).then((res) => {
      const resData = res?.data;
      resData.attacker_capability = resData?.attacker_capability?.map((factor) => ({
        ...factor,
        description: ATTACKER_CAPABILITY_FACTOR.find((f) => f.name === factor.name)?.description,
      }));

      resData.effectiveness_defender = resData?.effectiveness_defender?.map((factor) => ({
        ...factor,
        description: EFFECTIVENESS_OF_DEFENDER_FACTOR.find((f) => f.name === factor.name)
          ?.description,
      }));

      setConfigs(resData);
    });
  }, []);

  const setFactor = (factors, key) => {
    const newConfig = { ...configs };
    newConfig[key] = factors;
    setConfigs(newConfig);
  };

  const handleClickSave = () => {
    const factorErrs = [];
    for (let i = 0; i < configs.attacker_capability.length; i++) {
      const factor = configs.attacker_capability[i];
      if (factor.score === '') {
        factorErrs.push(factor.name);
      }
    }
    for (let i = 0; i < configs.effectiveness_defender.length; i++) {
      const factor = configs.effectiveness_defender[i];
      if (factor.score === '') {
        factorErrs.push(factor.name);
      }
    }
    if (factorErrs.length > 0) {
      message.error(`Please input score for ${factorErrs.join(', ')}`);
      return;
    }
    saveAptRiskSetting(deployment_scenario_id, configs)
      .then((res) => {
        message.success('Save done');
      })
      .catch((err) => {
        message.error('Save failed');
      });
  };

  return (
    <div style={{ maxHeight: 'calc(100vh - 384px)', overflow: 'auto' }}>
      <Collapse defaultActiveKey={['1', '2']}>
        <Panel header={'Attacker capability setting default'} key="1">
          <FactorList
            dataSource={configs?.attacker_capability}
            keyFactor="attacker_capability"
            updateFactor={setFactor}
          />
        </Panel>
        <Panel header={'Effectiveness of defender setting default'} key="2">
          <FactorList
            dataSource={configs?.effectiveness_defender}
            keyFactor="effectiveness_defender"
            updateFactor={setFactor}
          />
        </Panel>
      </Collapse>
      <Affix style={{ position: 'fixed', right: 50, bottom: 50, zIndex: 1000 }}>
        <Button type="primary" onClick={handleClickSave}>
          Save
        </Button>
      </Affix>
    </div>
  );
};

export default AptRiskSetting;
