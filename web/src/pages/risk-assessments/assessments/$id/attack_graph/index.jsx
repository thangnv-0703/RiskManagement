import { KEY_DATA_GRAPH } from '@/shared/constant';
import { AppstoreOutlined, LoadingOutlined } from '@ant-design/icons';
import { ModalForm } from '@ant-design/pro-form';
import { Affix, Button, Col, message, Modal, Row, Select, Table } from 'antd';
import GGEditor from 'gg-editor';
import React, { useEffect, useState } from 'react';
import { getAttackGraphDeploymentScenario } from '../service';
import { FlowContextMenu } from './components/EditorContextMenu';
import { FlowDetailPanel } from './components/EditorDetailPanel';
import { FlowItemPanel } from './components/EditorItemPanel';
import { FlowToolbar } from './components/EditorToolbar';
import CustomFlow from './CustomFlow';
import styles from './index.less';
import { updateAttackGraph } from './service';
GGEditor.setTrackable(false);

const FlowChart = ({ deployment_scenario_id }) => {
  const [loading, setLoading] = useState(false);
  const [dataGraph, setDataGraph] = useState({
    nodes: [],
    edges: [],
  });
  const [cves, setCVEs] = useState([]);
  const [attackers, setAttackers] = useState([]);
  const [assets, setAssets] = useState([]);
  const [isViewAsset, setIsViewAsset] = useState(false);
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
      const res = await getAttackGraphDeploymentScenario(deployment_scenario_id);
      const resData = res.data;
      if (resData) {
        setDataGraph(resData.attack_graph);
        setPhaseGraph(resData.attack_graph);
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
    <div style={{ height: 'calc(100vh - 384px)' }}>
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
        <Col span={2}>
          <AppstoreOutlined
            style={{ fontSize: '200%' }}
            onClick={() => setIsViewAsset(!isViewAsset)}
          />
        </Col>
      </Row>
      <GGEditor className={styles.editor}>
        <Row className={styles.editorHd}>
          <Col span={24}>
            <FlowToolbar />
          </Col>
        </Row>
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
      <Modal
        title="Attack graph info"
        destroyOnClose={true}
        wrapClassName="modal-fullscreen"
        onOk={() => setIsViewAsset(false)}
        onCancel={() => setIsViewAsset(false)}
      >
        <Table
          columns={[
            {
              title: 'Asset',
              dataIndex: 'asset_name',
            },
          ]}
          rowKey="asset_name"
          dataSource={cves}
          scroll={{ y: 350 }}
          expandable={{
            expandedRowRender: (row) => (
              <Table
                columns={[
                  {
                    title: 'CVE ID',
                    dataIndex: 'cve_id',
                  },
                  {
                    title: 'Attack Vector',
                    dataIndex: 'attack_vector',
                  },
                  {
                    title: 'Prerequisite',
                    dataIndex: 'condition',
                    render: (_) => _.preCondition,
                  },
                  {
                    title: 'Postcondition',
                    dataIndex: 'condition',
                    render: (_) => _.postCondition,
                  },
                  {
                    title: 'In Attack Graph',
                    dataIndex: 'cve_id',
                    render: (_) => {
                      let nodes = JSON.parse(localStorage.getItem(KEY_DATA_GRAPH));
                      nodes = nodes.nodes
                        .filter((n) => !n.is_attacker && n?.asset_id === row.asset_id)
                        .map((n) => n.cve_id);
                      return nodes.includes(_) ? '✅' : '❌';
                    },
                  },
                ]}
                dataSource={row.cves}
              />
            ),
          }}
        />
      </Modal>

      <Affix style={{ position: 'fixed', right: 50, bottom: 50, zIndex: 1000 }}>
        <Button type="primary" onClick={handleClickSave}>
          Save
        </Button>
      </Affix>
    </div>
  );
};

export default FlowChart;
