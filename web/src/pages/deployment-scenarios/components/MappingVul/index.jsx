import { Col, message, Row, Steps } from "antd"
import { useEffect, useState } from "react";
import styles from './index.less'

import AssetToCPE from "./AssetToCPE";
import CPEToCVE from "./CPEToCVE";

const { Step } = Steps;

const MappingVul = ({ deploymentScenario }) => {

    const [step, setStep] = useState(0);
    const [assets, setAssets] = useState([])

    useEffect(() => {
        if (deploymentScenario?.assets) {
            const tmpAssets = deploymentScenario.assets.map(as => ({ ...as, mapping_cpe: as.cpe }))
            setAssets(tmpAssets)
        }
    }, [deploymentScenario])

    const steps = [
        {
            id: 0,
            title: 'Mapping Asset to CPE',
            content: (
                <AssetToCPE
                    deploymentScenario={deploymentScenario}
                    assets={assets}
                    setAssets={setAssets}
                />
            ),
        },
        {
            id: 1,
            title: 'Mapping CPE to CVE',
            content: (
                <CPEToCVE
                    deploymentScenario={deploymentScenario}
                    assets={assets}
                    setAssets={setAssets}
                />
            ),
        },
    ];

    const handleOnChangeStep = (id) => {
        setStep(id);
    }
    return (
        <>
            <Steps current={step} onChange={handleOnChangeStep}>
                {steps.map(item => (
                    <Step key={item.id} title={item.title} style={{ cursor: 'pointer' }} />
                ))}
            </Steps>
            <div className={styles.steps_content}>
                {steps[step].content}
            </div>
        </>
    )
}

export default MappingVul