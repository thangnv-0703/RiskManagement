import { PageContainer } from '@ant-design/pro-layout';
import { ModalForm, ProFormSelect } from '@ant-design/pro-form';
import { Button, Upload, message, Space, Modal } from 'antd';
import { useEffect, useRef } from 'react';
import {
  getDeploymentScenarios,
  createDeploymentScenario,
  deleteDeploymentScenario,
  updateDeploymentScenario,
} from './service';
import { useState } from 'react';
import { history } from 'umi';
import {
  BugOutlined,
  DownloadOutlined,
  FireOutlined,
  MonitorOutlined,
  SafetyCertificateOutlined,
  SecurityScanOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import readXlsxFile from 'read-excel-file';
import ImportDeploymentScenario from './components/ImportDeploymentScenario';
import './index.less';
import { convertAssetType, mappingAssetType } from '@/shared/common';
import { getAssets } from '../assets/service';
import { getSystemProfiles } from '../system-profiles/list/service';
import {
  DEPLOYMENT_SCENARIO_DEPLOYMENTS,
  DEPLOYMENT_SCENARIO_OPERATIONS,
  DEPLOYMENT_SCENARIO_REQUIREMENTS_ANALYSIS,
  MAX_INT,
} from '@/shared/constant';
import * as Excel from 'exceljs';
import FileSaver from 'file-saver';
import { getCountermeasures } from '../countermeasures/service';
import ProTable from '@ant-design/pro-table';
import IconAction, {
  DeleteIconAction,
  DetailIconAction,
  EditIconAction,
} from '@/components/TableAction';
import MappingVul from './components/MappingVul';
import AttackerList from './components/attacker';
import EditDeploymentScenario from './components/EditDeploymentScenario';
import CountermeasureList from './components/countermeasures';
import { apiPrefix } from '@/services/api';

const SHEET_NAMES = ['General', 'Asset', 'Security goal', 'Asset relationship', 'Countermeasure'];

const DeploymentScenarios = () => {
  const fileExtension = '.xlsx';
  const fileName = 'deployment_scenario_template';

  const actionRef = useRef();

  const [importDeploymentScenario, setImportDeploymentScenario] = useState({});
  const [isModalImportVisible, setIsModalImportVisiable] = useState(false);
  const [visiableModalDownload, setVisiableModalDownload] = useState(false);
  const [isAdd, setIsAdd] = useState(true);
  const [visiableModalMapping, setVisiableModalMapping] = useState(false);
  const [currentDS, setCurrentDS] = useState({});
  const [visiableAttacker, setVisiableAttacker] = useState(false);
  const [visiableCountermeasures, setVisiableCountermeasures] = useState(false);
  const [visiableEditModal, setVisiableEditModal] = useState(false);

  const [systemProfiles, setSystemProfiles] = useState([]);

  const handleDelete = async (id) => {
    try {
      const success = await deleteDeploymentScenario(id);
      if (success) {
        message.success('Delete successful!');
        if (actionRef.current) {
          actionRef.current.reload();
        }
      }
    } catch {
      message.error('Delete failed!');
    }
  };

  const handleCloseAttacker = () => {
    setVisiableAttacker(false);
  };

  const handleCloseCountermeasures = () => {
    setVisiableCountermeasures(false);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
    },
    {
      title: 'System profile name',
      dataIndex: 'system_profile_name',
      key: 'system_profile_name',
      width: '20%',
    },
    {
      title: 'Stage',
      dataIndex: 'status',
      key: 'status',
      width: '20%',
      align: 'center',
    },
    {
      title: 'Created at',
      dataIndex: 'created_at',
      key: 'created_at',
      hideInForm: true,
      hideInSearch: true,
      valueType: 'date',
      width: '10%',
    },
    {
      title: 'Updated at',
      dataIndex: 'updated_at',
      key: 'updated_at',
      hideInForm: true,
      hideInSearch: true,
      valueType: 'date',
      width: '10%',
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'action',
      hideInForm: true,
      hideInSearch: true,
      width: '20%',
      align: 'center',
      render: (_, record) => (
        <Space>
          {record.status === DEPLOYMENT_SCENARIO_REQUIREMENTS_ANALYSIS && (
            <>
              <IconAction
                onClick={() => {
                  setVisiableAttacker(true);
                  setCurrentDS(record);
                }}
                title="Setup threat"
                icon={<FireOutlined />}
              />
              <IconAction
                onClick={() => {
                  history.push(`/deployment-scenarios/mapping/${record.id}`);
                  // setCurrentDS(record)
                  // setVisiableModalMapping(true)
                }}
                title="Mapping vulnerabilties on asset"
                icon={<BugOutlined />}
              />
              <IconAction
                onClick={() => {
                  setVisiableCountermeasures(true);
                  setCurrentDS(record);
                }}
                title="Setting countermeasure"
                icon={<SafetyCertificateOutlined />}
              />
              <IconAction
                onClick={() => {
                  history.push(`/risk-assessments/assessments/${record.id}`);
                }}
                title="Risk assessment"
                icon={<SecurityScanOutlined />}
              />
            </>
          )}
          {record.status === DEPLOYMENT_SCENARIO_OPERATIONS && (
            <>
              <IconAction
                onClick={() => {
                  setVisiableAttacker(true);
                  setCurrentDS(record);
                }}
                title="Setup threat"
                icon={<FireOutlined />}
              />
              <IconAction
                onClick={() => {
                  history.push(`/deployment-scenarios/mapping/${record.id}`);
                  // setCurrentDS(record)
                  // setVisiableModalMapping(true)
                }}
                title="Mapping vulnerabilties on asset"
                icon={<BugOutlined />}
              />
              <IconAction
                onClick={() => {
                  setVisiableCountermeasures(true);
                  setCurrentDS(record);
                }}
                title="Setting countermeasure"
                icon={<SafetyCertificateOutlined />}
              />
              <IconAction
                onClick={() => {
                  history.push(`/risk-monitoring/monitoring/${record.id}`);
                }}
                title="Risk monitoring"
                icon={<MonitorOutlined />}
              />
            </>
          )}
          {record.status === DEPLOYMENT_SCENARIO_DEPLOYMENTS && (
            <>
              <IconAction
                onClick={() => {
                  setVisiableAttacker(true);
                  setCurrentDS(record);
                }}
                title="Setup threat"
                icon={<FireOutlined />}
              />
              <IconAction
                onClick={() => {
                  history.push(`/deployment-scenarios/mapping/${record.id}`);
                  // setCurrentDS(record)
                  // setVisiableModalMapping(true)
                }}
                title="Mapping vulnerabilties on asset"
                icon={<BugOutlined />}
              />
              <IconAction
                onClick={() => {
                  setVisiableCountermeasures(true);
                  setCurrentDS(record);
                }}
                title="Setting countermeasure"
                icon={<SafetyCertificateOutlined />}
              />
              <IconAction
                onClick={() => {
                  history.push(`/risk-assessments/assessments/${record.id}`);
                }}
                title="Risk assessment"
                icon={<SecurityScanOutlined />}
              />
            </>
          )}

          <EditIconAction
            onClick={() => {
              setVisiableEditModal(true);
              setCurrentDS(record);
            }}
          />
          <DetailIconAction
            onClick={() => {
              history.push(`/deployment-scenarios/${record.id}`);
            }}
          />
          <DeleteIconAction
            onClick={() => {
              Modal.confirm({
                title: 'Delete deployment scenario',
                content: 'Are you sure？',
                okText: 'Ok',
                cancelText: 'Cancel',
                onOk: async () => await handleDelete(record.id),
              });
            }}
          />
        </Space>
      ),
    },
  ];

  const handleSelectFile = async (info) => {
    if (info.file.status === 'done') {
      try {
        const file = info.file.originFileObj;

        // General
        const generalSheet = await readXlsxFile(file, { sheet: SHEET_NAMES[0] });
        let tmpDeploymentScenarios = {};
        let targetRow = 0;
        tmpDeploymentScenarios.system_profile_id = generalSheet[1][2];
        tmpDeploymentScenarios.system_profile_name = generalSheet[2][2];
        generalSheet.forEach((row, index) => {
          if (row[0] === 'Deployment scenario') {
            targetRow = index;
          }
        });
        tmpDeploymentScenarios.name = generalSheet[targetRow + 1][2];
        tmpDeploymentScenarios.description = generalSheet[targetRow + 2][2];
        tmpDeploymentScenarios.status = generalSheet[targetRow + 3][2];
        tmpDeploymentScenarios.assets = [];
        tmpDeploymentScenarios.security_goals = [];
        tmpDeploymentScenarios.asset_relationships = [];
        tmpDeploymentScenarios.countermeasures = [];

        // Asset
        const assetSheet = await readXlsxFile(file, { sheet: SHEET_NAMES[1] });

        for (let i = 0; i < assetSheet.length; i++) {
          if (i < 4) continue;
          let asset = {};
          asset.id = assetSheet[i][0];
          asset.name = assetSheet[i][1];
          asset.part = mappingAssetType(assetSheet[i][2]);
          asset.server = assetSheet[i][3];
          asset.vendor = assetSheet[i][4];
          asset.product = assetSheet[i][5];
          asset.version = assetSheet[i][6];
          asset.custom_fields = {};
          let target = assetSheet[i][7];
          while (target) {
            target = assetSheet[i][7];
            asset.custom_fields[target] = assetSheet[i][8];
            if (i == assetSheet.length - 1) {
              break;
            }
            if (!assetSheet[i + 1][0]) {
              i++;
            } else {
              break;
            }
          }
          tmpDeploymentScenarios.assets.push(asset);
        }

        // Security goal
        const securityGoalSheet = await readXlsxFile(file, { sheet: SHEET_NAMES[2] });

        for (let i = 0; i < securityGoalSheet.length; i++) {
          if (i < 3) continue;
          let securityGoal = {};
          securityGoal.id = securityGoalSheet[i][0];
          securityGoal.name = securityGoalSheet[i][1];
          securityGoal.description = securityGoalSheet[i][2];
          securityGoal.asset_id = securityGoalSheet[i][3];
          securityGoal.confidentiality = securityGoalSheet[i][4];
          securityGoal.integrity = securityGoalSheet[i][5];
          securityGoal.availability = securityGoalSheet[i][6];
          tmpDeploymentScenarios.security_goals.push(securityGoal);
        }

        // Asset relationships
        const assetRelationshipSheet = await readXlsxFile(file, { sheet: SHEET_NAMES[3] });

        for (let i = 0; i < assetRelationshipSheet.length; i++) {
          if (i < 3) continue;
          let assetRelationship = {};
          assetRelationship.id = assetRelationshipSheet[i][0];
          assetRelationship.source = assetRelationshipSheet[i][1];
          assetRelationship.target = assetRelationshipSheet[i][2];
          assetRelationship.access_vector = assetRelationshipSheet[i][3];
          assetRelationship.privilege = assetRelationshipSheet[i][4];
          tmpDeploymentScenarios.asset_relationships.push(assetRelationship);
        }

        // Countermeasure
        const countermeasureSheet = await readXlsxFile(file, { sheet: SHEET_NAMES[4] });

        for (let i = 0; i < countermeasureSheet.length; i++) {
          if (i < 3) continue;
          let countermeasure = {};
          countermeasure.id = countermeasureSheet[i][0];
          countermeasure.name = countermeasureSheet[i][1];
          countermeasure.cost = countermeasureSheet[i][2];
          countermeasure.coverage = countermeasureSheet[i][3];
          countermeasure.cover_cves = countermeasureSheet[i][4].split(',');
          tmpDeploymentScenarios.countermeasures.push(countermeasure);
        }

        setImportDeploymentScenario(tmpDeploymentScenarios);
        setIsModalImportVisiable(true);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handleClickDownloadTemplate = () => {
    // const resAssets = await getAssets()
    // const res
    setVisiableModalDownload(true);
  };

  const exportExcel = async (systemProfile, assets, countermeasures) => {
    const workbook = new Excel.Workbook();
    workbook.c;

    // General
    const generalWorksheet = workbook.addWorksheet('General');
    let index = 5;
    generalWorksheet.mergeCells('A1', 'B1');
    generalWorksheet.getCell('A1').value = 'System profile';
    generalWorksheet.getRow(2).values = [null, 'ID', systemProfile.id];
    generalWorksheet.getRow(3).values = [null, 'Name', systemProfile.name];
    generalWorksheet.getRow(4).values = [null, 'Description', systemProfile.description];
    Object.keys(systemProfile.custom_fields).map((field) => {
      generalWorksheet.getRow(index).values = [null, field, systemProfile.custom_fields[field]];
      index++;
    });
    generalWorksheet.getRow(index++).values = [null, 'Created by', systemProfile.created_by];
    generalWorksheet.getRow(index++).values = [null, 'Updated by', systemProfile.updated_by];
    generalWorksheet.getRow(index++).values = [null, 'Created at', systemProfile.created_at];
    generalWorksheet.getRow(index++).values = [null, 'Updated at', systemProfile.updated_at];

    generalWorksheet.mergeCells(`A${index}`, `B${index}`);
    generalWorksheet.getCell(`A${index}`).value = 'Deployment scenario';
    index++;
    generalWorksheet.getRow(index++).values = [null, 'Name'];
    generalWorksheet.getRow(index++).values = [null, 'Description'];
    generalWorksheet.getRow(index++).values = [null, 'Stage'];

    // Asset
    const assetWorksheet = workbook.addWorksheet('Asset');
    assetWorksheet.mergeCells('A1', 'I1');
    assetWorksheet.getCell('A1').value = 'Asset';
    assetWorksheet.mergeCells('A3', 'A4');
    assetWorksheet.getCell('A3').value = 'ID';
    assetWorksheet.mergeCells('B3', 'B4');
    assetWorksheet.getCell('B3').value = 'Asset name';
    assetWorksheet.mergeCells('C3', 'C4');
    assetWorksheet.getCell('C3').value = 'Asset type';
    assetWorksheet.mergeCells('D3', 'D4');
    assetWorksheet.getCell('D3').value = 'Server';
    assetWorksheet.mergeCells('E3', 'E4');
    assetWorksheet.getCell('E3').value = 'Vendor';
    assetWorksheet.mergeCells('F3', 'F4');
    assetWorksheet.getCell('F3').value = 'Product';
    assetWorksheet.mergeCells('G3', 'G4');
    assetWorksheet.getCell('G3').value = 'Version';
    assetWorksheet.mergeCells('H3', 'I3');
    assetWorksheet.getCell('H3').value = 'Other';
    assetWorksheet.getCell('H4').value = 'Attribute';
    assetWorksheet.getCell('I4').value = 'Value';

    // Security Goal
    const securityGoalWorksheet = workbook.addWorksheet('Security goal');
    securityGoalWorksheet.mergeCells('A1', 'G1');
    securityGoalWorksheet.getCell('A1').value = 'Security Goal';
    securityGoalWorksheet.getRow(3).values = [
      'ID',
      'Name',
      'Description',
      'Asset ID',
      'Confidentiality',
      'Integrity',
      'Availability',
    ];

    // Asset Relationship
    const assetRelationshipWorksheet = workbook.addWorksheet('Asset relationship');
    assetRelationshipWorksheet.mergeCells('A1', 'E1');
    assetRelationshipWorksheet.getCell('A1').value = 'Asset Relationship';
    assetRelationshipWorksheet.getRow(3).values = [
      'ID',
      'Asset ID source',
      'Asset ID target',
      'Access vector',
      'Privilege',
    ];

    // Countermeasure
    const countermeasureWorksheet = workbook.addWorksheet('Countermeasure');
    countermeasureWorksheet.mergeCells('A1', 'E1');
    countermeasureWorksheet.getCell('A1').value = 'Countermeasure';
    countermeasureWorksheet.getRow(3).values = [
      'ID',
      'Name',
      'Cost',
      'Coverage',
      'Coverage CVE_ID',
    ];
    // countermeasureWorksheet.

    // Data Asset
    const dataAssetWorksheet = workbook.addWorksheet('Data Asset');
    dataAssetWorksheet.mergeCells('A1', 'C1');
    dataAssetWorksheet.getCell('A1').value = 'Data Asset';
    dataAssetWorksheet.getRow(3).values = ['ID', 'Asset name', 'Asset type'];
    dataAssetWorksheet.columns = [{ key: 'id' }, { key: 'name' }, { key: 'part' }];
    assets.forEach((asset) =>
      dataAssetWorksheet.addRow({
        ...asset,
        part: convertAssetType(asset.part),
      }),
    );

    // Data Countermeasure
    const dataCountermeasureWorksheet = workbook.addWorksheet('Data Countermeasure');
    dataCountermeasureWorksheet.mergeCells('A1', 'C1');
    dataCountermeasureWorksheet.getCell('A1').value = 'Data Countermeasure';
    dataCountermeasureWorksheet.getRow(3).values = ['ID', 'Name', 'Coverage CVE_ID'];
    dataCountermeasureWorksheet.columns = [{ key: 'id' }, { key: 'name' }, { key: 'cover_cves' }];
    countermeasures.forEach((countermeasure) =>
      dataCountermeasureWorksheet.addRow({
        ...countermeasure,
        cover_cves: countermeasure.cover_cves.join(','),
      }),
    );

    await workbook.xlsx
      .writeBuffer()
      .then((buffer) => FileSaver.saveAs(new Blob([buffer]), fileName + fileExtension))
      .catch((err) => console.log('Error writing excel export', err));
  };

  const handleDownloadTemplate = async (value) => {
    try {
      const systemProfile = systemProfiles.find((item) => item.id == value.system_profile);
      const assetsRes = await getAssets({
        pageSize: MAX_INT,
      });
      const countermeasureRes = await getCountermeasures({
        pageSize: MAX_INT,
      });
      const assets = assetsRes.data || [];
      const countermeasures = countermeasureRes.data || [];
      await exportExcel(systemProfile, assets, countermeasures);
      message.success('Download successful!');
      return true;
    } catch (err) {
      console.log(err);
      message.error('Download failed!');
      return false;
    }
  };

  const handleCreateDeploymentScenario = async (value) => {
    const sendData = {
      ...importDeploymentScenario,
      ...value,
    };
    const res = await createDeploymentScenario(sendData);
    if (res) {
      message.success(`${isAdd ? 'Add' : 'Edit'} deployment scenario successful!`);
      if (actionRef.current) {
        actionRef.current.reload();
      }
      return true;
    }
    message.error(`${isAdd ? 'Add' : 'Edit'} deployment scenario failed!`);
    return false;
  };

  const fetchData = async () => {
    try {
      const systemProfilesRes = await getSystemProfiles({
        pageSize: MAX_INT,
      });
      setSystemProfiles(systemProfilesRes.data || []);
    } catch (e) {
      console.log(e);
      message.error('Error!');
    }
  };

  const handleCloseEditModal = () => {
    setVisiableEditModal(false);
  };
  const handleEditSave = () => {};

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <PageContainer>
      <ProTable
        // headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        request={getDeploymentScenarios}
        columns={columns}
        pagination={{
          pageSize: 10,
          hideOnSinglePage: true,
        }}
        toolbar={{
          settings: [],
        }}
        bordered
        toolBarRender={() => [
          <Button icon={<DownloadOutlined />} onClick={handleClickDownloadTemplate} key="download">
            Download template
          </Button>,
          <Upload
            onChange={(info) => handleSelectFile(info)}
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            showUploadList={false}
            key="upload"
            action={`${apiPrefix}/api/upload_file`}
          >
            <Button icon={<UploadOutlined />}>Import</Button>
          </Upload>,
          // <Button
          //     type="primary"
          //     key="add"
          //     onClick={() => {
          //         // setVisibleModal(true);
          //     }}
          // >
          //     <PlusOutlined /> Add
          // </Button>,
        ]}
      />
      <ModalForm
        title={`${isAdd ? 'Add' : 'Edit'} deployment scenario`}
        // width="400px"
        visible={isModalImportVisible}
        onVisibleChange={setIsModalImportVisiable}
        modalProps={{
          destroyOnClose: true,
          wrapClassName: 'modal-fullscreen',
        }}
        initialValues={importDeploymentScenario}
        onFinish={handleCreateDeploymentScenario}
      >
        <ImportDeploymentScenario importData={importDeploymentScenario} />
      </ModalForm>
      <ModalForm
        title="Download template deployment scenario"
        width="400px"
        visible={visiableModalDownload}
        onVisibleChange={setVisiableModalDownload}
        modalProps={{
          okText: 'Download',
          destroyOnClose: true,
          wrapClassName: 'normal-modal',
        }}
        onFinish={handleDownloadTemplate}
      >
        <ProFormSelect
          name="system_profile"
          label="Deployment scenario for system profile"
          options={systemProfiles.map((sp) => ({
            label: sp.name,
            value: sp.id,
          }))}
          placeholder="Please select a system profile"
          rules={[{ required: true }]}
        />
      </ModalForm>
      <ModalForm
        title="Mapping vulnerabilities on asset"
        // width="400px"
        visible={visiableModalMapping}
        onVisibleChange={setVisiableModalMapping}
        modalProps={{
          destroyOnClose: true,
          wrapClassName: 'modal-fullscreen',
        }}
        initialValues={currentDS}
        onFinish={() => false}
      >
        <MappingVul deploymentScenario={currentDS} />
      </ModalForm>
      <Modal
        title="Threat"
        destroyOnClose={true}
        wrapClassName="modal-fullscreen"
        open={visiableAttacker}
        onOk={handleCloseAttacker}
        onCancel={handleCloseAttacker}
      >
        <AttackerList deployment_scenario_id={currentDS.id} />
      </Modal>
      <Modal
        title="Countermeasures"
        destroyOnClose={true}
        wrapClassName="modal-fullscreen"
        open={visiableCountermeasures}
        onOk={handleCloseCountermeasures}
        onCancel={handleCloseCountermeasures}
      >
        <CountermeasureList deployment_scenario_id={currentDS.id} />
      </Modal>
      <ModalForm
        title="Edit deployment scenario"
        // width="400px"
        visible={visiableEditModal}
        onVisibleChange={setVisiableEditModal}
        modalProps={{
          destroyOnClose: true,
        }}
        initialValues={currentDS}
        onFinish={async (values) => {
          const res = await updateDeploymentScenario(currentDS.id, values);
          if (res) {
            message.success('Edit done!');
            if (actionRef.current) {
              actionRef.current.reload();
            }
            return true;
          }
          return false;
        }}
      >
        <EditDeploymentScenario deploymentScenario={currentDS} />
      </ModalForm>
    </PageContainer>
  );
};

export default DeploymentScenarios;
