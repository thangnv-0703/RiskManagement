import { KEY_DATA_GRAPH } from '@/shared/constant';
import { Col, Input, Row, Select } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import GGEditor from 'gg-editor';
import React, { useEffect, useState } from 'react';
import { FlowContextMenu } from './components/EditorContextMenu';
import { FlowDetailPanel } from './components/EditorDetailPanel';
import { FlowItemPanel } from './components/EditorItemPanel';
import { FlowToolbar } from './components/EditorToolbar';
import CustomFlow from './CustomFlow';
import styles from './index.less';
import { set } from 'lodash';
GGEditor.setTrackable(false);

const FlowChart = ({ riskAssessmentReport }) => {
  const [loading, setLoading] = useState(true);
  const [dataGraph, setDataGraph] = useState({
    nodes: [],
    edges: [],
  });
  const [cves, setCVEs] = useState([]);
  const [attackers, setAttackers] = useState([]);
  const [assets, setAssets] = useState([]);
  const [phaseGraph, setPhaseGraph] = useState({
    nodes: [],
    edges: [],
  });
  const [phase, setPhase] = useState(1);
  const phaseData = [
    {
      value: 1,
      label: 'Phase 1 - Preparing',
    },
    {
      value: 2,
      label: 'Phase 2 - Access',
    },
    {
      value: 3,
      label: 'Phase 3 - Resident',
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setDataGraph(riskAssessmentReport?.deployment_scenario?.attack_graph);
      setPhaseGraph(riskAssessmentReport?.deployment_scenario?.attack_graph);

      const assets = riskAssessmentReport?.deployment_scenario?.assets;
      const tmpCVEs = riskAssessmentReport?.deployment_scenario?.cves.map((cve) => ({
        ...cve,
        asset_name: assets?.find((as) => as.id === cve.asset_id)?.name,
      }));
      setCVEs(tmpCVEs);
      setAssets(assets);
      setAttackers(riskAssessmentReport?.deployment_scenario?.attackers);
      localStorage.setItem(
        KEY_DATA_GRAPH,
        JSON.stringify(riskAssessmentReport?.deployment_scenario?.attack_graph),
      );
      setLoading(false);
    };
    fetchData();
  }, []);

  const onChangePhase = (value) => {
    const nodes = dataGraph.nodes.filter((node) => node.phase.includes(value));
    const edges = dataGraph.edges.filter((edge) => edge.phase.includes(value));
    setPhaseGraph({
      nodes: nodes,
      edges: edges,
    });
    setPhase(value);
  };

  if (loading) return <LoadingOutlined style={{ fontSize: 25 }} />;
  return (
    <>
      <Row
        style={{
          marginBottom: 15,
        }}
      >
        <Col span={2}>APT Phase</Col>
        <Col span={20}>
          <Select
            style={{
              width: '50%',
            }}
            value={phase}
            options={phaseData}
            onChange={onChangePhase}
            showSearch
          ></Select>
        </Col>
      </Row>
      <GGEditor className={styles.editor}>
        {/* <SaveButton setGraph={setGraph} /> */}
        <Row className={styles.editorHd}>
          <Col span={24}>
            <FlowToolbar />
          </Col>
        </Row>
        <Row className={styles.editorBd}>
          <Col span={19} className={styles.editorContent}>
            <CustomFlow
              className={styles.flow}
              data={phaseGraph}
              cves={cves}
              attackers={attackers}
              assets={assets}
            />
          </Col>
          <Col span={5} className={styles.editorSidebar}>
            <FlowDetailPanel
              cves={cves}
              setDataGraph={setDataGraph}
              attackers={attackers}
              assets={assets}
              phase={phase}
            />
          </Col>
        </Row>
        <FlowContextMenu />
      </GGEditor>
    </>
  );
};

export default FlowChart;
