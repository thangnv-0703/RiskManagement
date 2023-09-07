import { DEPLOYMENT_SCENARIO_REQUIREMENTS_ANALYSIS, DEPLOYMENT_SCENARIO_DEPLOYMENTS, DEPLOYMENT_SCENARIO_STAGE, DEPLOYMENT_SCENARIO_OPERATIONS } from "@/shared/constant"
import { ExclamationCircleOutlined, ExclamationOutlined } from "@ant-design/icons"
import { ProFormSelect, ProFormText, ProFormTextArea } from "@ant-design/pro-form"
import { Col, Row } from "antd"



const EditDeploymentScenario = ({ deploymentScenario }) => {
    return (
        <>
            <ProFormText
                name="name"
                label="Name"
                rules={[
                    {
                        required: true,
                    }
                ]}
                placeholder="Please enter a name"
            />
            <ProFormTextArea
                name="description"
                label="Description"
                rules={[
                    {
                        required: true,
                    }
                ]}
                placeholder="Please enter a description"
            />
            <ProFormSelect
                name="status"
                label="Stage"
                tooltip={{
                    title: `Stage "${DEPLOYMENT_SCENARIO_OPERATIONS}" cannot switch back to stage "${DEPLOYMENT_SCENARIO_DEPLOYMENTS}"`,
                    icon: <ExclamationCircleOutlined style={{color: 'red'}}/>
                }}
                options={
                    DEPLOYMENT_SCENARIO_STAGE.map(stage => ({
                        label: stage,
                        value: stage,
                    }))
                }
                rules={[
                    {
                        required: true,
                    }
                ]}
                placeholder="Please choose a satge"
            />
        </>
    )
}

export default EditDeploymentScenario