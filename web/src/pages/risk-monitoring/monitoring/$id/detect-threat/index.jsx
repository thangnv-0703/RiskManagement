// import { getCVEonAttackGraph } from '@/pages/';
import { ATTACKER_TYPE } from '@/shared/constant';
import ProForm, { ProFormDigit, ProFormSelect } from '@ant-design/pro-form';
import { Col, Row } from 'antd';
import { useState, useEffect } from 'react';
import { detectThreat, getCVEonAttackGraph } from '../service';

const DetectThreat = ({ deployment_scenario_id }) => {
  const [cvesInAttackGraph, setCVEsInAttackGraph] = useState([]);
  const [assets, setAssets] = useState([]);
  const [estThreat, setEstThreat] = useState(0);
  const [threatTypes, setThreatTypes] = useState(ATTACKER_TYPE);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getCVEonAttackGraph(deployment_scenario_id);
      const resData = res?.data;
      if (resData) {
        const cves = resData.attack_graph.nodes.filter(
          (node) => !node.is_asset && !node.is_attacker && node.phase.includes(3),
        );
        setCVEsInAttackGraph(cves);
        setAssets(resData?.assets);
      }
    };
    fetchData();
  }, []);

  const handleSubmitForm = async (values) => {
    const { observer_prob, cve } = values;

    const resData = await detectThreat(deployment_scenario_id, {
      cve_id: cve.split('_')[0],
      asset_id: cve.split('_')[1],
      observer_probability: observer_prob,
    });
    // console.log('Res', resData);
    if (resData) {
      if (resData?.data?.est >= 0.1) {
        setEstThreat(resData.data.est);
        setThreatTypes(resData.data.threat_types);
        setIsSubmitted(true);
      }
    }
  };

  return (
    <Row gutter={16}>
      <Col span={12}>
        <ProForm onFinish={handleSubmitForm} onChange={() => setIsSubmitted(false)}>
          {/* <ProFormGroup> */}
          <ProFormSelect
            name="cve"
            label="CVE"
            options={cvesInAttackGraph.map((item) => ({
              label: `${item.cve_id} on ${assets.find((a) => a.id === item.asset_id)?.name}`,
              value: `${item.cve_id}_${item.asset_id}`,
            }))}
            placeholder="Please select a cve"
            rules={[{ required: true }]}
            width="md"
          />
          <ProFormDigit
            name="observer_prob"
            label="Observer probability"
            max={1}
            min={0}
            placeholder="Please input observer probability"
            rules={[{ required: true }]}
            width="md"
          />

          {/* </ProFormGroup> */}
        </ProForm>
      </Col>
      <Col span={12}>
        {isSubmitted ? (
          <ProForm
            initialValues={{
              est_probability: estThreat,
            }}
          >
            <ProFormDigit
              name="est_probability"
              label="Estimate probability"
              max={1}
              min={0}
              rules={[{ required: true }]}
              width="md"
              disabled
            />
            <ProFormSelect
              name="threat_type"
              label="Threat type"
              options={ATTACKER_TYPE.map((item) => ({
                label: threatTypes.includes(item) ? `👍 ${item}` : `  ${item}`,
                value: `${item}`,
              }))}
              placeholder="Please select a threat type"
              rules={[{ required: true }]}
              width="md"
            />
          </ProForm>
        ) : (
          <b>No threat detected</b>
        )}
      </Col>
    </Row>
  );
};

export default DetectThreat;
