
import { LoadingOutlined } from '@ant-design/icons';
import { message, Radio, Space, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useRequest } from 'umi';
import { mappingCPE } from '../../service';

const MappingCPE = ({ asset, cpe, setCPE }) => {

    const [loading, setLoading] = useState(false)
    const [cpes, setCPEs] = useState([])
    const [currentCPE, setCurrentCPE] = useState('')

    const onChangeCPE = (e) => {
        let target = e.target.value
        setCurrentCPE(target)
    }

    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
        setCPE(newSelectedRowKeys)
    };

    const columns = [
        {
            title: 'Type',
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
            title: 'Update',
            dataIndex: 'update',
            key: 'update',
        },
        {
            title: 'Edition',
            dataIndex: 'edition',
            key: 'edition',
        },
    ]

    const [selectedRowKeys, setSelectedRowKeys] = useState(cpe);

    useEffect(() => {
        const mapping = async () => {
            if (cpes) {
                setLoading(true)
                // const data = await mappingCPE({
                //     keyword: `${asset.product} ${asset.version}`
                // })
                const data = 1
                if (data) {
                    setCPEs(sample_data.map(d => ({...d, key: d.id})))
                } else {
                    message.error('Error')
                }
                setLoading(false)
            }
        }
        mapping()
    }, [])

    if (loading) {
        return <LoadingOutlined />
    }

    return (
        <Table 
            rowSelection={{
                selectedRowKeys,
                onChange: onSelectChange,
                type: 'radio',
            }} 
            columns={columns} 
            dataSource={cpes}
            scroll={{ y: 150}}
        />
    )
}

export default MappingCPE