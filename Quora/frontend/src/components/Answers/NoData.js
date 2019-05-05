import React, {Component} from 'react'
import { Empty } from 'antd';

class NoData extends Component {
  render() {
    return (
      <Empty
        image={this.props.image}
      imageStyle={{
        height: 60,
      }}
      description={
        <div style={{marginLeft:this.props.left}}>
          {this.props.description}
        </div>
      }
    >
    </Empty>
    )
  }
}

export default NoData;