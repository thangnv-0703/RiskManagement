import { KEY_DATA_GRAPH } from '@/shared/constant';
import { LoadingOutlined } from '@ant-design/icons';
import { Affix, Button, Col, message, Row, Select } from 'antd';
import GGEditor from 'gg-editor';
import React, { useEffect, useState } from 'react';
import { getAttackGraphDeploymentScenario } from '../service';
import { FlowContextMenu } from './components/EditorContextMenu';
import { FlowDetailPanel } from './components/EditorDetailPanel';
import { FlowItemPanel } from './components/EditorItemPanel';
import CustomFlow from './CustomFlow';
import styles from './index.less';
import { updateAttackGraph } from './service';
GGEditor.setTrackable(false);

const AttackGraphMonitoring = ({ deployment_scenario_id, sync, setSync }) => {
  const [loading, setLoading] = useState(false);
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
      const resData = await getAttackGraphDeploymentScenario(deployment_scenario_id);
      if (resData) {
        setDataGraph(resData.attack_graph);
        setPhaseGraph(resData.attack_graph);
        setDataGraph(resData.attack_graph);
        setCVEs(resData.cves);
        setAttackers(resData.attackers);
        setAssets(resData.assets);
        localStorage.setItem(KEY_DATA_GRAPH, JSON.stringify(resData.attack_graph));
      }
      setLoading(false);
    };
    fetchData();
  }, [deployment_scenario_id]);

  const handleClickSave = async () => {
    const graph = JSON.parse(localStorage.getItem(KEY_DATA_GRAPH));
    const newNodes = graph.nodes.filter((node) => !node.phase);
    const newEdges = graph.edges.filter((edge) => !edge.phase);
    const newGraph = {
      nodes: dataGraph.nodes.concat(...newNodes.map((node) => ({ ...node, phase: [phase] }))),
      edges: dataGraph.edges.concat(...newEdges.map((edge) => ({ ...edge, phase: [phase] }))),
    };
    setDataGraph(newGraph);
    const res = await updateAttackGraph(deployment_scenario_id, {
      attack_graph: dataGraph,
    });
    if (res) {
      message.success('Save done!');
    }
  };

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
        <Row className={styles.editorBd}>
          <Col span={3} className={styles.editorSidebar}>
            <FlowItemPanel />
          </Col>
          <Col span={16} className={styles.editorContent}>
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
      <Affix style={{ position: 'fixed', right: 50, bottom: 50, zIndex: 1000 }}>
        <Button type="primary" onClick={handleClickSave}>
          Save
        </Button>
      </Affix>
    </>
  );
};

export default AttackGraphMonitoring;
