import { getSystemProfile } from "@/pages/system-profiles/list/service";
import { convertAssetType, convertDatetimeISO } from "@/shared/common";
import { generatorID } from "@/shared/key";
import { Col, Row, Table, Tabs } from "antd"
import GGEditor from "gg-editor"
import { useEffect, useState } from "react"
import CustomFlow from "./asset-relationship/CustomFlow";
import { generateCoordinates, getDeploymentScenario } from "../service";
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


const DetailDeploymentScenario = ({ deployment_scenario_id }) => {

    const [dataAsset, setDataAsset] = useState([])
    const [dataCountermeasure, setDataCountermeasure] = useState([])
    const [dataSecurityGoal, setDataSecurityGoal] = useState([])
    const [dataAssetRelationship, setDataAssetRelationship] = useState([])
    const [systemProfile, setSystemProfile] = useState({})
    const [deploymentInfo, setDeploymentInfo] = useState({})

    const addStyleAssetType = (type) => {
        switch (type) {
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
            width: '10%',
            ellipsis: true,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: '20%',
        },
        {
            title: 'Asset type',
            dataIndex: 'part',
            key: 'part',
            width: '10%',
            render: (_) => convertAssetType(_)
        },
        {
            title: 'Server',
            dataIndex: 'server',
            key: 'server',
            width: '10%',
        },
        {
            title: 'Vendor',
            dataIndex: 'vendor',
            key: 'vendor',
            width: '10%',
        },
        {
            title: 'Product',
            dataIndex: 'product',
            key: 'product',
            width: '10%',
        },
        {
            title: 'Version',
            dataIndex: 'version',
            key: 'version',
            width: '10%',
        },
        {
            title: 'Other',
            dataIndex: 'custom_fields',
            key: 'custom_fields',
            width: '30%',
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
            width: '10%',
            ellipsis: true,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: '40%',
        },
        {
            title: 'Cost',
            dataIndex: 'cost',
            key: 'cost',
            width: '10%',
        },
        {
            title: 'Coverage',
            dataIndex: 'coverage',
            key: 'coverage',
            width: '10%',
        },
        {
            title: 'Coverage CVE',
            dataIndex: 'cover_cves',
            key: 'cover_cves',
            width: '30%',
            render: (_, record) => (
                <ul>
                    {
                        record.cover_cves.map((item) => (<li key={item}>{item}</li>))
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
            width: '10%',
            ellipsis: true,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: '20%',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: '30%',
        },
        {
            title: 'Asset',
            dataIndex: 'asset_id',
            key: 'asset_id',
            width: '20%',
            render: (asset_id) => dataAsset.find(item => item.id === asset_id).name
        },
        {
            title: 'C - I - A',
            dataIndex: 'c_i_a',
            key: 'c_i_a',
            width: '20%',
            render: (_, record) => `${record.confidentiality} - ${record.integrity} - ${record.availability}`
        },
    ]

    useEffect(() => {
        const syncData = async () => {
            try {
                const res = await getDeploymentScenario(deployment_scenario_id)
                setDeploymentInfo(res.data)
                setDataAsset(res.data.assets)
                setDataCountermeasure(res.data.countermeasures)
                setDataSecurityGoal(res.data.security_goals)
                const generateGraph = await generateCoordinates({
                    'graph': {
                        'nodes': res.data.assets.map(asset => ({
                            ...asset,
                            'id': asset.id,
                            'label': asset.name,
                            ...addStyleAssetType(asset.part),
                        })),
                        'edges': res.data.asset_relationships.map((item) => ({
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
                const systemProfileRes = await getSystemProfile(res.data.system_profile_id)
                setSystemProfile(systemProfileRes.data)

            } catch (e) {
                console.log(e);
            }
        }
        syncData()
    }, [])

    if (systemProfile.description) {
        return (
            <Tabs defaultActiveKey="1" >
                <TabPane tab="General" key="1">
                    <Row gutter={16} >
                        <Col span={12}>
                            <b>System profile</b>
                            <ul>
                                <li>{`Name: ${systemProfile.name}`}</li>
                                <li>{`Description: ${systemProfile.description}`}</li>
                                {
                                    Object.keys(systemProfile.custom_fields).map(field => (
                                        <li key={field}>{`${field}: ${systemProfile.custom_fields[field]}`}</li>
                                    ))
                                }
                                <li>{`Created at: ${convertDatetimeISO(systemProfile.created_at)}`}</li>
                                <li>{`Updated at: ${convertDatetimeISO(systemProfile.updated_at)}`}</li>
                            </ul>
                        </Col>
                        <Col span={12}>
                            <b>Deployment scenario information</b>
                            <ul>
                                <li>{`Name: ${deploymentInfo.name}`}</li>
                                <li>{`Stage: ${deploymentInfo.status}`}</li>
                                <li>{`Description: ${deploymentInfo.description}`}</li>
                            </ul>
                        </Col>
                    </Row>
                </TabPane>
                <TabPane tab="Assets" key="2">
                    <Table
                        columns={columnsAsset}
                        dataSource={dataAsset}
                        scroll={{ y: 350 }}
                        pagination={false}
                    />
                </TabPane>
                <TabPane tab="Security goals" key="3">
                    <Table
                        columns={columnsSecurityGoal}
                        dataSource={dataSecurityGoal}
                        scroll={{ y: 350 }}
                        pagination={false}
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
                        dataSource={dataCountermeasure.map((d, index) => ({
                            ...d,
                            id: index+ 1,
                        }))}
                        scroll={{ y: 350 }}
                        pagination={false}
                    />
                </TabPane>
            </Tabs>
        )
    } else {
        return ""
    }

}
export default DetailDeploymentScenario