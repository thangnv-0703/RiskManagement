import { Card, Descriptions } from "antd"
import { history } from "umi"



const DeploymentScenarioInfo = ({ deploymentScenario, column, systemProfile }) => {

    return (
        <Card>
            <Descriptions title="Deployment scenario info" column={column}>
                <Descriptions.Item label="Name">{deploymentScenario.name}</Descriptions.Item>
                <Descriptions.Item label="System profile">
                    <a
                        onClick={() => {
                            history.push(`/system-profiles/${systemProfile.id}`)
                        }}
                    >
                        {systemProfile.name}
                    </a>
                </Descriptions.Item>
                <Descriptions.Item label="Description">{deploymentScenario.description}</Descriptions.Item>
                <Descriptions.Item label="Stage">{deploymentScenario.status}</Descriptions.Item>
            </Descriptions>
        </Card>
    )
}

export default DeploymentScenarioInfo