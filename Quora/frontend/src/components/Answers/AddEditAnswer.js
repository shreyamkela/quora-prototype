
import React, { Component } from 'react'
import {Card,Avatar,Icon,Input,Button} from 'antd';
import {connect} from 'react-redux';
const {Meta} = Card;
const TextArea = Input.TextArea;

class AddEditAnswer extends Component {
    render() {
        return (
            <div>
                <Card
                    title={<Meta
                        avatar={<Avatar
                        src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>}
                        title="User's name goes here"
                        description="credentials"        
                    />}
                    style={{ width: "90%", marginTop: 16,marginLeft:20,marginRight:40 }}
                    
                    
                >
                    <div style={{width:"100%"}}>
                    <TextArea rows={6} placeholder="Write your answer"></TextArea><br></br>
                    <div style={{background:"#fafafa",padding:"15px",width:"100%"}}><Button type="primary">Submit</Button><Icon style={{float:"right"}} type="ellipsis"/></div>
                    </div>
                </Card>
            </div>
        )
    }
}

export default AddEditAnswer;