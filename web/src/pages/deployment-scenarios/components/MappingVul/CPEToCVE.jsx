import { convertAssetType } from "@/shared/common";
import { Col, message, Row, Select, Space, Typography } from "antd"
import { useEffect, useRef, useState } from "react";
import './index.less'
import { LoadingOutlined } from "@ant-design/icons";
import { getCVEonAsset } from "../../service";

import ProTable from "@ant-design/pro-table";
import CVSSSeverity from "@/components/CVSSServerity";



const { Option, OptGroup } = Select;
const { Paragraph } = Typography

const CPEToCVE = ({ deploymentScenario, assets, setAssets }) => {

    const [assetsHasCPE, setAssetsHasCPE] = useState([])
    const [cves, setCVEs] = useState([])
    const [stateAssets, setStateAssets] = useState(false)

    const actionRef = useRef()

    const [isLoading, setLoading] = useState(false)

    const [currentAsset, setCurrentAsset] = useState({})

    const handleSelectAsset = (value) => {
        const asset = assets.find(as => as.id === value)
        setCurrentAsset(asset)
        if (actionRef.current) {
            actionRef.current.reload();
        }
    }

    const columns = [
        {
            title: 'CVE ID',
            dataIndex: 'cve_id',
            key: 'cve_id',
            width: '20%'
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: '60%',
            render: (_) => (
                <Paragraph ellipsis={{ tooltip: _, rows: 3 }}>
                    {_}
                </Paragraph>
            )
        },
        {
            title: 'CVSS Severity',
            dataIndex: 'impact',
            key: 'cvss',
            width: '20%',
            render: (impact) => (
                <Space
                    direction="vertical"
                    size="middle"
                >
                    <div>
                        V3: <CVSSSeverity cvss={impact?.baseMetricV3?.cvssV3?.baseScore} />
                    </div>
                    <div>
                        V2: <CVSSSeverity cvss={impact?.baseMetricV2?.cvssV2?.baseScore} />
                    </div>
                </Space>
            )
        },
    ]

    useEffect(() => {
        setStateAssets(true)
        const tmp = assets.filter(as => as.mapping_cpe)
        setAssetsHasCPE(tmp)
        if (tmp?.length < assets?.length){
            message.error('Please mapping all asset to CPE!')
        }else{
            setStateAssets(false)
        }
    }, [assets])

    if(stateAssets){
        return ''
    }

    return (
        <>
            <Row gutter={16}>
                <Col span={2}>
                    <label>Asset : </label>
                </Col>
                <Col span={8}>
                    <Select
                        onChange={handleSelectAsset}
                        value={currentAsset?.id}
                        style={{
                            width: 300,
                        }}
                        placeholder="Please select a asset"
                    >
                        <OptGroup label="Has CPE">
                            {
                                assetsHasCPE.map(as => (
                                    <Option key={as.id} value={as.id}>{as.name}</Option>
                                ))
                            }
                        </OptGroup>
                    </Select>
                </Col>
                <Col span={2}>
                    {isLoading && <LoadingOutlined style={{ fontSize: '200%' }} />}
                </Col>
                <Col span={12}>
                    {
                        currentAsset?.name && (
                            <ul>
                                <li>{`Name: ${currentAsset.name}`}</li>
                                <li>{`Type: ${convertAssetType(currentAsset.part)}`}</li>
                                <li>{`Vendor: ${currentAsset.vendor}`}</li>
                                <li>{`Product: ${currentAsset.product}`}</li>
                                <li>{`Version: ${currentAsset.version}`}</li>
                                <li>{`CPE: ${currentAsset.cpe}`}</li>
                            </ul>
                        )
                    }
                </Col>
            </Row>
            {
                currentAsset?.name && (
                    <Row style={{ marginTop: 20 }}>
                        <Col span={24}>
                            <ProTable
                                actionRef={actionRef}
                                rowKey="cve_id"
                                search={false}
                                request={async({pageSize, current}) => {
                                   const res = await getCVEonAsset(deploymentScenario.id, currentAsset.id, {
                                        pageSize: pageSize,
                                        current: current
                                   })
                                   return res
                                }}
                                columns={columns}
                                pagination={{
                                    pageSize: 10,
                                }}
                                toolbar={{
                                    settings: []
                                }}
                                bordered
                            />
                        </Col>
                    </Row>
                )
            }
        </>
    )
}

export default CPEToCVE