import { Col, Row } from 'antd';
import GGEditor, { Flow } from 'gg-editor';
import React from 'react';
import { FlowContextMenu } from './components/EditorContextMenu';
import { FlowDetailPanel } from './components/EditorDetailPanel';
import { FlowItemPanel } from './components/EditorItemPanel';
import { FlowToolbar } from './components/EditorToolbar';
import CustomFlow from './CustomFlow';
import styles from './index.less';
GGEditor.setTrackable(false);


const FlowChart = ({ cves, dataGraph }) => {
  return (
    // <PageContainer>
    <GGEditor className={styles.editor}>
      {/* <SaveButton setGraph={setGraph} /> */}
      <Row className={styles.editorHd}>
        <Col span={24}>
          <FlowToolbar />
        </Col>
      </Row>
      <Row className={styles.editorBd}>
        {/* <Col span={3} className={styles.editorSidebar}>
          <FlowItemPanel />
        </Col> */}
        <Col span={19} className={styles.editorContent}>
          <CustomFlow
            className={styles.flow}
            data={dataGraph}
          />
          {/* <EditableLabel /> */}
        </Col>
        <Col span={5} className={styles.editorSidebar}>
          <FlowDetailPanel cves={cves} />
          {/* <EditorMinimap /> */}
        </Col>
      </Row>
      <FlowContextMenu />
    </GGEditor>
    // </PageContainer>
  )
}

export default FlowChart
