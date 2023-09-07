import { cwe } from '@/pages/data/cwe/service';
import { getDeploymentScenario } from '@/pages/deployment-scenarios/service';
import { EXPLOITABILITY, MAX_INT, REMEDIATION_LEVEL, REPORT_CONFIDENCE } from '@/shared/constant';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Descriptions, Steps } from 'antd';
import { useEffect, useState } from 'react';
import Assessment from './assessment';
import FlowChart from './attack_graph';
import CountermeasuresSetting from './countermeasures';
import styles from './index.less';
import VulnerabiliesAnalysis from './vulnerability-analysis';
import VulnerabilySetting from './vulnerability-setting';
import AptRiskSetting from './apt-risk-setting';

const { Step } = Steps;

const AssessmentForm = (props) => {
  const { id } = props?.match?.params;

  const [current, setCurrent] = useState(0);
  const [vuls, setVuls] = useState([]);
  const [assets, setAssets] = useState([]);
  const [countermeasures, setCountermeasures] = useState([]);
  const [damageCriterion, setDamageCriterion] = useState(100);
  const [benefitCriterion, setBenefitCriterion] = useState(100);
  const [exploitability, setExploitability] = useState('High');
  const [remediationLevel, setRemediationLevel] = useState('Unavailable');
  const [reportConfidence, setReportConfidence] = useState('Confirmed');

  const [deploymentScenario, setDeploymentScenario] = useState({});
  const [cwes, setCWEs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getDeploymentScenario(id);
      setDeploymentScenario(res.data);
      const resCWE = await cwe({
        pageSize: MAX_INT,
      });
      setCWEs(resCWE.data);
      setExploitability(res.data.exploitability);
      setRemediationLevel(res.data.remediation_level);
      setReportConfidence(res.data.report_confidence);
    };
    fetchData();
  }, []);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const steps = [
    {
      id: 0,
      title: 'Vulnerability Analysis',
      content: (
        <VulnerabiliesAnalysis
          deployment_scenario_id={id}
          assets={assets}
          setAssets={setAssets}
          cwes={cwes}
        />
        // <FlowChart cves={vuls} dataGraph={attackGraph} />
      ),
    },
    {
      id: 1,
      title: 'Vulnerability Setting',
      content: (
        <VulnerabilySetting
          deployment_scenario_id={id}
          assets={assets}
          setAssets={setAssets}
          cwes={cwes}
          exploitability={exploitability}
          setExploitability={setExploitability}
          remediationLevel={remediationLevel}
          setRemediationLevel={setRemediationLevel}
          reportConfidence={reportConfidence}
          setReportConfidence={setReportConfidence}
        />
        // <FlowChart cves={vuls} dataGraph={attackGraph} />
      ),
    },
    {
      id: 2,
      title: 'Attack Graph',
      content: (
        <FlowChart
          // cves={vuls}
          // dataGraph={attackGraph}
          deployment_scenario_id={id}
        />
      ),
    },
    {
      id: 3,
      title: 'Countermeasure Setting',
      content: (
        <CountermeasuresSetting
          countermeasures={countermeasures}
          setCountermeasures={setCountermeasures}
          vuls={vuls}
          damageCriterion={damageCriterion}
          setDamageCriterion={setDamageCriterion}
          benefitCriterion={benefitCriterion}
          setBenefitCriterion={setBenefitCriterion}
          deployment_scenario_id={id}
        />
      ),
    },
    {
      id: 4,
      title: 'Factor Setting',
      content: (
        <AptRiskSetting
          countermeasures={countermeasures}
          setCountermeasures={setCountermeasures}
          vuls={vuls}
          damageCriterion={damageCriterion}
          setDamageCriterion={setDamageCriterion}
          benefitCriterion={benefitCriterion}
          setBenefitCriterion={setBenefitCriterion}
          deployment_scenario_id={id}
        />
      ),
    },
    {
      id: 5,
      title: 'Assessment',
      content: (
        <Assessment
          deployment_scenario_id={id}
          damageCriterion={damageCriterion}
          benefitCriterion={benefitCriterion}
          exploitability={exploitability}
          remediationLevel={remediationLevel}
          reportConfidence={reportConfidence}
        />
      ),
    },
  ];

  const handleOnChangeStep = (id) => {
    setCurrent(id);
  };

  return (
    <PageContainer
      style={{ height: 'calc(100vh - 72px)' }}
      header={{
        title: 'Risk assessment',
      }}
      content={
        <Descriptions column={2} style={{ marginBottom: -16 }}>
          <Descriptions.Item label="For deployment scenario">
            <a onClick={() => {}}>{deploymentScenario.name}</a>
          </Descriptions.Item>
        </Descriptions>
      }
    >
      <Card style={{ height: 'calc(100vh - 204px)' }}>
        <Steps current={current} onChange={handleOnChangeStep} items={steps}></Steps>
        <div className={styles.steps_content} style={{ maxHeight: '100%' }}>
          {steps[current].content}
        </div>
        <div className="steps-action">
          {current > 0 && (
            <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
              Previous
            </Button>
          )}
          {current < steps.length - 1 && (
            <Button type="primary" onClick={() => next()}>
              Next
            </Button>
          )}
        </div>
      </Card>
    </PageContainer>
  );
};

export default AssessmentForm;
