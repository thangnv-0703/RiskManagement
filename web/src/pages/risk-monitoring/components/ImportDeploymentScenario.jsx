import { generatorID } from "@/shared/key";
import { Col, Row, Table, Tabs } from "antd"
import GGEditor, { Flow } from "gg-editor"
import { useEffect, useState } from "react"
import CustomFlow from "../monitoring/$id/attack_graph/CustomFlow";
import { generateCoordinates } from "../service";
import styles from './index.less';

const { TabPane } = Tabs

const SHAPE_OS = {
    shape: "flow-circle",
    color: "#FA8C16"
}
const SHAPE_APP = {
    shape: "flow-rect",
    color: "#1890FF",
}
const SHAPE_HW = {
    shape: "flow-capsule",
    color: "#722ED1"
}


const ImportDeploymentScenario = ({ importData }) => {
    console.log('Import data', importData);
    const [dataAsset, setDataAsset] = useState([])
    const [dataCountermeasure, setDataCountermeasure] = useState([])
    const [dataSecurityGoal, setDataSecurityGoal] = useState([])
    const [dataAssetRelationship, setDataAssetRelationship] = useState([])

    const convertAssetType = (type) => {
        switch(type){
            case 'o':
                return SHAPE_OS;
            case 'h':
                return SHAPE_HW;
            case 'a':
                return SHAPE_APP;
            default:
                return {}
        }
    }

    const columnsAsset = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Asset type',
            dataIndex: 'part',
            key: 'part',
        },
        {
            title: 'Vendor',
            dataIndex: 'vendor',
            key: 'vendor',
        },
        {
            title: 'Product',
            dataIndex: 'product',
            key: 'product',
        },
        {
            title: 'Version',
            dataIndex: 'version',
            key: 'version',
        },
        {
            title: 'Other',
            dataIndex: 'custom_fields',
            key: 'custom_fields',
            render: (_, record) => (
                <ul>
                    {
                        Object.keys(record.custom_fields).map((item) => (<li key={item}>{`${item}: ${record.custom_fields[item]}`}</li>))
                    }
                </ul>
            )
        },
    ]

    const columnsCountermeasure = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Cost',
            dataIndex: 'cost',
            key: 'cost',
        },
        {
            title: 'Coverage',
            dataIndex: 'coverage',
            key: 'coverage',
        },
        {
            title: 'Coverage CVE',
            dataIndex: 'cves',
            key: 'cves',
            render: (text) => (
                <ul>
                    {
                        text.split(',').map((item) => (<li key={item}>{item}</li>))
                    }
                </ul>
            )
        },
    ]

    const columnsSecurityGoal = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Asset',
            dataIndex: 'asset_id',
            key: 'asset_id',
            render: (asset_id) => dataAsset.find(item => item.id === asset_id).name
        },
        {
            title: 'Confidentiality',
            dataIndex: 'confidentiality',
            key: 'confidentiality',
        },
        {
            title: 'Integrity',
            dataIndex: 'integrity',
            key: 'integrity',
        },
        {
            title: 'Availability',
            dataIndex: 'availability',
            key: 'availability',
        },
    ]

    useEffect(() => {
        const syncData = async () => {
            try {
                if (importData !== {}) {
                    let tmpDataAsset = importData.assets
                    setDataAsset(tmpDataAsset)
                    setDataCountermeasure(importData.countermeasures)
                    setDataSecurityGoal(importData.security_goals)
                    const generateGraph = await generateCoordinates({
                        'graph': {
                            'nodes': importData.assets.map(asset => ({
                                ...asset,
                                'id': asset.id,
                                'label': asset.name,
                                ...convertAssetType(asset.part),
                            })),
                            'edges': importData.asset_relationships.map((item) => ({
                                ...item,
                                'id': generatorID(),
                            })),
                        },
                        'nodesep': 1,
                        'ranksep': 2,
                    })
                    let tmpGraph = generateGraph.data.graph
                    tmpGraph.edges = tmpGraph.edges.map((edge) => ({
                        ...edge,
                        'label': `${edge.access_vector} - ${edge.privilege}`
                    }))
                    setDataAssetRelationship(generateGraph.data.graph)
                }
            } catch (e) {
                console.log(e);
            }
        }
        syncData()
    }, [importData])

    if (importData !== {}) {
        return (
            <Tabs defaultActiveKey="1" >
                <TabPane tab="General" key="1">
                    Content of Tab Pane 1
                </TabPane>
                <TabPane tab="Assets" key="2">
                    <Table
                        columns={columnsAsset}
                        dataSource={dataAsset}
                    />
                </TabPane>
                <TabPane tab="Security goals" key="3">
                    <Table
                        columns={columnsSecurityGoal}
                        dataSource={dataSecurityGoal}
                    />
                </TabPane>
                <TabPane tab="Asset relationships" key="4">
                    <GGEditor className={styles.editor}>
                        <Row className={styles.editorBd}>
                            <CustomFlow
                                className={styles.flow}
                                data={dataAssetRelationship}
                            />
                        </Row>
                    </GGEditor>
                </TabPane>
                <TabPane tab="Countermeasures" key="5">
                    <Table
                        columns={columnsCountermeasure}
                        dataSource={dataCountermeasure}
                    />
                </TabPane>
            </Tabs>
        )
    } else {
        return ""
    }

}
export default ImportDeploymentScenario