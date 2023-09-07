import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Descriptions, Steps } from 'antd';
import { useEffect, useState } from 'react';
import FlowChart from './attack_graph';
import CountermeasuresSettingDetail from './countermeasures';
import AptRiskDetail from './apt-risk-setting';
import styles from './index.less';
import { getRiskAssessment } from './service';
import VulnerabilySettingDetail from './vulnerability-setting';
import { history } from 'umi';
import ResultDetail from './assessment';

const { Step } = Steps;

const AssessmentDetail = (props) => {
  const { id } = props?.match?.params;

  const [current, setCurrent] = useState(0);
  const [riskAssessmentReport, setRiskAssessmentReport] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const res = await getRiskAssessment(id);
      setRiskAssessmentReport(res.data);
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
      title: 'Vulnerability',
      content: <VulnerabilySettingDetail riskAssessmentReport={riskAssessmentReport} />,
    },
    {
      id: 1,
      title: 'Attack Graph',
      content: <FlowChart riskAssessmentReport={riskAssessmentReport} />,
    },
    // {
    //   id: 2,
    //   title: 'Countermeasures',
    //   content: <CountermeasuresSettingDetail riskAssessmentReport={riskAssessmentReport} />,
    // },
    {
      id: 2,
      title: 'Factors',
      content: <AptRiskDetail riskAssessmentReport={riskAssessmentReport} />,
    },
    {
      id: 3,
      title: 'Result',
      content: <ResultDetail riskAssessmentReport={riskAssessmentReport} />,
    },
  ];

  const handleOnChangeStep = (id) => {
    setCurrent(id);
  };

  return (
    <PageContainer
      header={{
        title: 'Risk assessment detail',
      }}
      content={
        <Descriptions column={1} style={{ marginBottom: -16 }}>
          <Descriptions.Item label="For deployment scenario">
            <a
              onClick={() => {
                history.push(
                  `/deployment-scenarios/${riskAssessmentReport?.deployment_scenario.id}`,
                );
              }}
            >
              {riskAssessmentReport?.deployment_scenario?.name}
            </a>
          </Descriptions.Item>
          <Descriptions.Item label="Risk assessment name">
            <a onClick={() => {}}>{riskAssessmentReport?.name}</a>
          </Descriptions.Item>
        </Descriptions>
      }
    >
      <Card>
        <Steps current={current} onChange={handleOnChangeStep}>
          {steps.map((item) => (
            <Step key={item.id} title={item.title} style={{ cursor: 'pointer' }} />
          ))}
        </Steps>
        <div className={styles.steps_content}>{steps[current].content}</div>
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

export default AssessmentDetail;
