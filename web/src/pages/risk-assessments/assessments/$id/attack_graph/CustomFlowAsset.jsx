
import React from "react";
import { withPropsAPI, Flow } from 'gg-editor';
import { KEY_DATA_GRAPH } from "@/shared/constant";
import '@antv/g6/build/plugin.tool.tooltip';
import G6 from '@antv/g6'
import './style.css'

// const tooltip = new G6.Tooltip({
//     getContent(e) {
//         return `<div style='width: 180px;'>
//           <ul id='menu'>
//             <li title='1'>example 01</li>
//             <li title='2'>example 02</li>
//             <li>example 03</li>
//             <li>example 04</li>
//             <li>example 05</li>
//           </ul>
//         </div>`;
//     },
// })

class CustomFlowAsset extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: this.props.data,
        }
    }
    componentDidUpdate() {
        this.props.propsAPI.executeCommand('autoZoom')
        // this.props.propsAPI.executeCommand('resetZoom')
        // console.log('DidUpdate');
    }
    componentDidMount() {
        this.props.propsAPI.executeCommand('autoZoom')
        // this.props.propsAPI.executeCommand('resetZoom')
        // console.log('DidMount');
        // console.log('CVEs', this.props.cves);
        // console.log('Threat', this.props.attackers);
        localStorage.setItem('CVES', JSON.stringify(this.props.cves))
        localStorage.setItem('THREATS', JSON.stringify(this.props.attackers))
        // this.setState({
        //     data: localStorage.getItem(KEY_DATA_GRAPH)
        // })
    }

    render() {
        return (
            <Flow
                className={this.props.className}
                data={this.props.data}
                onAfterChange={() => {
                    const d = JSON.stringify(this.props.propsAPI.save())
                    localStorage.setItem(KEY_DATA_GRAPH, d)
                    this.setState({
                        data: d
                    })
                }}
                graph={{
                    plugins: [ 
                        new G6.Plugins['tool.tooltip']({
                            getTooltip({ item }) {
                                try {
                                    if (item) {
                                        const model = item.getModel();
                                        if (model?.source && model?.target) {
                                            const tmpData = JSON.parse(localStorage.getItem(KEY_DATA_GRAPH))
                                            const cves = JSON.parse(localStorage.getItem('CVES'))
                                            const threats = JSON.parse(localStorage.getItem('THREATS'))
                                            let {source, target} = model
                                            source = tmpData?.nodes?.find(i => i.id === source)
                                            target = tmpData?.nodes?.find(i => i.id === target)
                                            const targetCVE = cves.find(as => as.asset_id === target?.asset_id)?.cves?.find(cve => cve.cve_id === target?.cve_id)
                                            if (!source.is_attacker){
                                                source = cves.find(as => as.asset_id === source?.asset_id)?.cves?.find(cve => cve.cve_id === source?.cve_id)
                                                return `
                                                    <div class="tooltip-ag">
                                                        <h4>${source.cve_id}</h4>
                                                        <ul>
                                                            <li>Attack vector: ${source.attack_vector}</li>
                                                            <li>Prerequisite: ${source.condition.preCondition}</li>
                                                            <li>Post condition: ${source.condition.postCondition}</li>
                                                        </ul>
                                                        <h4>${targetCVE.cve_id}</h4>
                                                        <ul>
                                                            <li>Attack vector: ${targetCVE.attack_vector}</li>
                                                            <li>Prerequisite: ${targetCVE.condition.preCondition}</li>
                                                            <li>Post condition: ${targetCVE.condition.postCondition}</li>
                                                        </ul>
                                                    </div>
                                                `
                                            } else {
                                                source = threats.find(at => at.id === source.attacker_id)
                                                const target_asset = source.targets.find(t => t.asset_id == target.asset_id)
                                                source.attack_vector = target_asset?.attack_vector || 'N/A'
                                                source.privilege = target_asset?.privilege || 'N/A'
                                                return `
                                                    <div class="tooltip-ag">
                                                        <h4>${source.name}</h4>
                                                        <ul>
                                                            <li>Attack vector: ${target_asset?.attack_vector || 'N/A'}</li>
                                                            <li>Privilege: ${target_asset?.privilege || 'N/A'}</li>
                                                        </ul>
                                                        <h4>${targetCVE.cve_id}</h4>
                                                        <ul>
                                                            <li>Attack vector: ${targetCVE.attack_vector}</li>
                                                            <li>Prerequisite: ${targetCVE.condition.preCondition}</li>
                                                            <li>Post condition: ${targetCVE.condition.postCondition}</li>
                                                        </ul>
                                                    </div>
                                                `
                                            }                                     
                                            
                                            
                                        }
                                    }
                                } catch {
                                    return ``
                                }
                            }
                        })
                        
                    ]
                }}
            />
        )
    }
}
export default withPropsAPI(CustomFlowAsset)