import React, { Component } from 'react';
import 'antd/lib/input/style';
import 'antd/lib/tooltip/style';
import './index.less';
import Input from 'antd/lib/input';
import Tooltip from 'antd/lib/tooltip';
import { store } from "../../store/index";
import { update } from "../../store/action";

interface Istate {
  time: string
}


const Search = Input.Search;

export default class nav extends Component<{},Istate> {
  constructor(props: object) {
    super(props);
    let vm = this;
    this.state = {
      time: this.getTime()
    }
    setInterval(() => {
      vm.setState({
        time: vm.getTime()
      })
    }, 1000)
  }

  /**
   * 获取当前时间并格式化
   */
  getTime(): string {
    const time = new Date();
    let year = time.getFullYear();
    let month = time.getMonth() + 1;
    let day = time.getDay();
    let hour = time.getHours();
    let minutes = time.getMinutes();
    let seconds = time.getSeconds();
    let temp = (hour > 12 ? '下午' : '上午');
    hour = (temp === '上午' ? hour : hour - 12);
    return `${year}/${month}/${day} ${temp}${hour}:${minutes}:${seconds}`
  }

  /**
   * 更换城市
   * @param value 城市名
   */
  updateCity(value: string) {
    store.dispatch(update(value));
  }

  render() {
    return (
      <div className="n-page">
          <Search
            placeholder="输入城市名(中文)"
            onSearch={this.updateCity}
            style={{ width: 200 }}
          />
          <Tooltip title={this.state.time}>
            <span className="n-floatR n-cfff">{this.state.time}</span>
          </Tooltip>
      </div>
    )
  }
}
