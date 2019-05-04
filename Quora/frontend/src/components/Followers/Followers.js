import React, { Component } from "react";
import cookie from "react-cookies";
import {connect} from "react-redux";
import {
    List, message, Avatar, Spin,
} from 'antd';
import reqwest from 'reqwest';

import InfiniteScroll from 'react-infinite-scroller';
const fakeDataUrl = 'https://randomuser.me/api/?results=20&inc=name,gender,email,nat&noinfo';


class Followers extends Component{

    state = {
        data: [],
        loading: false,
        hasMore: true,
    }

    componentDidMount() {
        this.fetchData((res) => {
            this.setState({
                data: res.results,
            });
        });
    }

    fetchData = (callback) => {
        reqwest({
            url: fakeDataUrl,
            type: 'json',
            method: 'get',
            contentType: 'application/json',
            success: (res) => {
                callback(res);
            },
        });
    }

    handleInfiniteOnLoad = () => {
        let data = this.state.data;
        this.setState({
            loading: true,
        });
        if (data.length > 14) {
            message.warning('Infinite List loaded all');
            this.setState({
                hasMore: false,
                loading: false,
            });
            return;
        }
        this.fetchData((res) => {
            data = data.concat(res.results);
            this.setState({
                data,
                loading: false,
            });
        });
    }

    render(){
        return(
            <div>
                <InfiniteScroll
                    initialLoad={false}
                    pageStart={0}
                    loadMore={this.handleInfiniteOnLoad}
                    hasMore={!this.state.loading && this.state.hasMore}
                    useWindow={false}
                >
                    <List
                        dataSource={this.state.data}
                        renderItem={item => (
                            <List.Item key={item.id}>
                                <List.Item.Meta
                                    avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                    title={<a href="https://ant.design">{item.name.last}</a>}
                                    description={item.email}
                                />
                            </List.Item>
                        )}
                    >
                        {this.state.loading && this.state.hasMore && (
                            <div className="demo-loading-container">
                                <Spin />
                            </div>
                        )}
                    </List>
                </InfiniteScroll>
            </div>
        )
    }
}

//This method is provided by redux and it gives access to centeral store
function mapStateToProps(state) {
    return;
}
export default connect(mapStateToProps)(Followers);
