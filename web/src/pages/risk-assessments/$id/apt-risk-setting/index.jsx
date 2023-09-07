import { Affix, Button, Collapse, Typography, Card, message, Row, Col, Select, Input } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useState } from 'react';
import { FactorList } from './components/factor-list';
import {
  AGGREGATE_FUNCTION,
  ATTACKER_CAPABILITY_FACTOR,
  EFFECTIVENESS_OF_DEFENDER_FACTOR,
} from '@/shared/constant';
const { Panel } = Collapse;

const AptRiskDetail = (props) => {
  const { riskAssessmentReport } = props;
  const attacker_capability = riskAssessmentReport?.supplement_config?.attacker_capability?.map(
    (factor) => ({
      ...factor,
      description: ATTACKER_CAPABILITY_FACTOR.find((f) => f.name === factor.name)?.description,
    }),
  );

  const effectiveness_defender =
    riskAssessmentReport?.supplement_config?.effectiveness_defender?.map((factor) => ({
      ...factor,
      description: EFFECTIVENESS_OF_DEFENDER_FACTOR.find((f) => f.name === factor.name)
        ?.description,
    }));

  return (
    <div style={{ maxHeight: 'calc(100vh - 384px)', overflow: 'auto' }}>
      <Collapse defaultActiveKey={['1', '2']}>
        <Panel header={'Attacker capability setting default'} key="1">
          <FactorList dataSource={attacker_capability} keyFactor="attacker_capability" />
        </Panel>
        <Panel header={'Effectiveness of defender setting default'} key="2">
          <FactorList dataSource={effectiveness_defender} keyFactor="effectiveness_defender" />
        </Panel>
      </Collapse>
    </div>
  );
};

export default AptRiskDetail;
