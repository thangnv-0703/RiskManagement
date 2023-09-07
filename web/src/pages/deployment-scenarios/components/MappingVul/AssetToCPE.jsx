import { convertAssetType } from '@/shared/common';
import { Button, Col, Input, message, Radio, Row, Select, Space, Table } from 'antd';
import { useEffect, useState } from 'react';
import './index.less';
import { LoadingOutlined } from '@ant-design/icons';
import { mappingCPE, updateDeploymentScenarioOneAsset } from '../../service';

const { Option, OptGroup } = Select;

const AssetToCPE = ({ deploymentScenario, assets, setAssets }) => {
  const [assetsNoCPE, setAssetsNoCPE] = useState([]);
  const [assetsHasCPE, setAssetsHasCPE] = useState([]);
  const [cpes, setCPEs] = useState([]);
  const [visiableMappingTable, setVisiableMappingTable] = useState(false);
  const [keyword, setKeyword] = useState('');

  const [isLaodingSearch, setLoadingSearch] = useState(false);
  const [isLoadingAssign, setLoadingAssign] = useState(false);

  const [currentAsset, setCurrentAsset] = useState({});

  const handleSelectAsset = async (value) => {
    setKeyword('');
    setCPEs([]);
    const asset = assets.find((as) => as.id === value);
    setCurrentAsset(asset);
    setLoadingSearch(true);
    const dataRes = await mappingCPE({
      keyword: `${asset.product} ${asset.version}`,
    });
    // const dataRes = 1
    if (dataRes) {
      setCPEs(dataRes.cpes?.map((d) => ({ ...d, key: d.id })));
      setVisiableMappingTable(true);
      // setCPEs(sample_data.map(d => ({ ...d, key: d.id })))
    } else {
      message.error('Error');
    }
    setLoadingSearch(false);
  };
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setAssets(
      assets.map((as) => {
        if (as.id === currentAsset.id)
          return {
            ...as,
            mapping_cpe: newSelectedRowKeys[0],
          };
        return as;
      }),
    );
    setCurrentAsset({ ...currentAsset, mapping_cpe: newSelectedRowKeys[0] });
  };

  const handleSaveMapping = async () => {
    setLoadingAssign(true);
    const sendData = {
      ...currentAsset,
      cpe: currentAsset.mapping_cpe,
    };
    const resData = await updateDeploymentScenarioOneAsset(
      deploymentScenario.id,
      currentAsset.id,
      sendData,
    );
    if (resData) {
      setAssets(
        assets.map((as) => {
          if (as.id === currentAsset.id)
            return {
              ...as,
              mapping_cpe: currentAsset.mapping_cpe,
              cpe: currentAsset.mapping_cpe,
            };
          return as;
        }),
      );
      setCurrentAsset({ ...currentAsset, cpe: currentAsset.mapping_cpe });
      message.success('Save done!');
      setSelectedRowKeys([]);
    } else {
      message.error('Error!');
    }
    setLoadingAssign(false);
  };

  const handleChangeKeywork = (e) => {
    setKeyword(e.target.value);
  };

  const handleSearchKeyword = async () => {
    if (!keyword) {
      message.error('Please input Keyword');
      return;
    }
    if (!keyword.trim()) {
      message.error('Please input Keyword');
      return;
    }
    setLoadingSearch(true);
    const dataRes = await mappingCPE({
      keyword: keyword.trim(),
    });
    if (dataRes) {
      setCPEs(dataRes.cpes.map((d) => ({ ...d, key: d.id })));
      setVisiableMappingTable(true);
    } else {
      message.error('Error');
    }
    setLoadingSearch(false);
  };

  const columns = [
    {
      title: 'CPE',
      dataIndex: 'id',
      key: 'id',
      width: '40%',
    },
    {
      title: 'Type',
      dataIndex: 'part',
      key: 'part',
      width: '10%',
      render: (_) => convertAssetType(_),
    },
    {
      title: 'Vendor',
      dataIndex: 'vendor',
      key: 'vendor',
      width: '20%',
    },
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
      width: '20%',
    },
    {
      title: 'Version',
      dataIndex: 'version',
      key: 'version',
      width: '10%',
    },
  ];

  useEffect(() => {
    setAssetsNoCPE(assets.filter((as) => !as.mapping_cpe));
    setAssetsHasCPE(assets.filter((as) => as.mapping_cpe));
  }, [assets]);

  return (
    <>
      <Row gutter={16}>
        <Col span={2}>
          <label>Asset : </label>
        </Col>
        <Col span={10}>
          <Select
            onChange={handleSelectAsset}
            value={currentAsset?.id}
            style={{
              width: 300,
            }}
            placeholder="Please select a asset"
          >
            <OptGroup label="No CPE">
              {assetsNoCPE.map((as) => (
                <Option key={as.id} value={as.id}>
                  {as.name}
                </Option>
              ))}
            </OptGroup>
            <OptGroup label="Has CPE">
              {assetsHasCPE.map((as) => (
                <Option key={as.id} value={as.id}>
                  {as.name}
                </Option>
              ))}
            </OptGroup>
          </Select>
        </Col>
        <Col span={12}>
          {currentAsset?.name && (
            <ul>
              <li>{`Name: ${currentAsset.name || ''}`}</li>
              <li>{`Type: ${convertAssetType(currentAsset.part)}`}</li>
              <li>{`Vendor: ${currentAsset.vendor || ''}`}</li>
              <li>{`Product: ${currentAsset.product || ''}`}</li>
              <li>{`Version: ${currentAsset.version || ''}`}</li>
              <li>{`CPE: ${currentAsset.cpe || ''}`}</li>
              <li>{`Mapping CPE: ${currentAsset.mapping_cpe || ''}`}</li>
            </ul>
          )}
        </Col>
      </Row>
      {
        <>
          {currentAsset?.id && (
            <Row style={{ marginTop: 20 }} gutter={16}>
              <Col span={4}>Find with keyword</Col>
              <Col span={6}>
                <Input value={keyword} onChange={handleChangeKeywork} />
              </Col>
              <Col span={11}>
                <Button type="primary" disabled={!keyword} onClick={handleSearchKeyword}>
                  Search
                </Button>
              </Col>
              <Col span={3}>
                <Button
                  type="primary"
                  onClick={handleSaveMapping}
                  disabled={selectedRowKeys.length === 0}
                  loading={isLoadingAssign}
                >
                  Assign
                </Button>
              </Col>
            </Row>
          )}
          <Row style={{ marginTop: 20 }}>
            <Col span={24}>
              <Table
                rowSelection={{
                  selectedRowKeys,
                  onChange: onSelectChange,
                  type: 'radio',
                }}
                columns={columns}
                dataSource={cpes?.map((d) => ({ ...d, key: d.id }))}
                bordered
                loading={isLaodingSearch}
              />
            </Col>
          </Row>
        </>
      }
    </>
  );
};

export default AssetToCPE;
