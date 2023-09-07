
import React from "react";
import { withPropsAPI, Flow } from 'gg-editor';
import { KEY_DATA_GRAPH } from "@/shared/constant";

class CustomFlow extends React.Component {
  constructor(props) {
    super(props)
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
  }
  render() {
    return (
      <Flow
        className={this.props.className}
        data={this.props.data}
        onAfterChange={() => {
          localStorage.setItem(KEY_DATA_GRAPH, JSON.stringify(this.props.propsAPI.save()))
        }}
      />
    )
  }
}
export default withPropsAPI(CustomFlow)