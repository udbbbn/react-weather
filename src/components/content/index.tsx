import React, { Component } from 'react';
import 'antd/lib/breadcrumb/style';
import 'antd/lib/table/style';
import Breadcrumb from 'antd/lib/breadcrumb';
import Table from 'antd/lib/table';
import BreadcrumbItem from 'antd/lib/breadcrumb/BreadcrumbItem';
import jsonp from "jsonp";
import CryptoJS from 'crypto-js';
import { store } from "../../store/index";

import './index.less';

interface Istate {
  weather: any,
  dailyWeather: any,
  location: location
}
interface location {
  province: string,
  city: string
}

export default class content extends Component<{}, Istate> {
  // 知心天气API
  private API:string = "https://api.seniverse.com/v3/weather/";
  private KEY:string  = "6caevcsvwkmtunzl";
  private uid:string  = "UDBA707165";
  private ts:number = Math.floor((new Date()).getTime() / 1000);// 获取当前时间戳
  private str:string  = `ts=${this.ts}&uid=${this.uid}`;// 构造验证参数字符串
  // 使用 HMAC-SHA1 方式，以 API 密钥（key）对上一步生成的参数字符串（raw）进行加密
  // 并将加密结果用 base64 编码，并做一个 urlencode，得到签名 sig
  private sig:string  = CryptoJS.HmacSHA1(this.str, this.KEY).toString(CryptoJS.enc.Base64);
  // private sig = encodeURIComponent(this.sig);
  public weather:object = {};
  public dailyWeather:object = {};

  // antd 表格columns
  public columns:Array<object> = [{
    title: '日期',
    key: 'date',
    dataIndex: 'date'
  }, {
    title: '温度',
    key: 'temp' ,
    dataIndex: 'temp'
  }, {
    title: '天气情况',
    key: 'weather',
    dataIndex: 'weather'
  }, {
    title: '风向',
    key: 'wind_dire',
    dataIndex: 'wind_dire'
  }, {
    title: '风速',
    key: 'wind_speed',
    dataIndex: 'wind_speed'
  }, {
    title: '风力',
    key: 'wind_scale',
    dataIndex: 'wind_scale'
  }];
  public dataSource: Array<object> = [];

  constructor(props: object) {
    super(props);
    this.sig = encodeURIComponent(this.sig);
    this.str = this.str + "&sig=" + this.sig;
    this.state = {
      weather: {},
      dailyWeather: {},
      location: {
        province: '',
        city: ''
      }
    };
    store.subscribe(this.listenUpdate.bind(this));
  }

  /**
   * 调用心知天气获取当前天气
   */
  getWeather(
    location: string = 'ip',
    ) {
    let vm:this = this;
    let apiRouter:string = "now.json";
    let api:string = `${this.API}${apiRouter}?location=${location}&${this.str}`;
    jsonp(`${api}`,(err, res) => {
      if (err) {
        alert(err);
      } else {
        let { path } = res.results[0].location;
        path = path.split(',').reverse();
        let location:location = {
          province: path[1],
          city: path[2]
        }
        vm.setState({
          weather: res.results[0]
        })
        vm.setState({
          location: location
        })
        console.log(vm.state.weather);
      }
    });
  }

  /**
   * 心知天气-获取未来3天天气
   */
  getDailyWeather(
    location: string = 'ip',
    ) {
    let vm:this = this;
    let apiRouter:string = "daily.json";
    let api:string = `${this.API}${apiRouter}?location=${location}&${this.str}&start=0&days=5`;
    jsonp(`${api}`,(err, res) => {
      if (err) {
        alert(err);
      } else {
        vm.dataSource = vm.formatData(res.results[0].daily);
        vm.setState({
          dailyWeather: res.results[0],
        })
        console.log(res.results[0]);
      }
    });
  }

  /**
   * 生成antd Table 所需格式数据
   */
  formatData(data: Array<object>): Array<object> {
    let res: Array<object> = [];
    let hour:string = new Date().getHours() > 12 ? '下午' : '上午';
    data.map((el: any, index: number) => {
      let elDate = new Date(el.date).getDate();
      let nowDate = new Date().getDate();
      let date:string = elDate === nowDate ? '今天' 
                        : elDate - nowDate == 1 ? '明天'
                        : '后天';
      res.push({
        key: index,
        date: date,
        temp: `${el.low}°/${el.high}°`,
        weather: hour === '上午' ? el.text_day : el.text_night,
        wind_dire: el.wind_direction,
        wind_speed: el.wind_speed + 'km/h',
        wind_scale: el.wind_scale + '级'
      })
    });
    return res
  }

  /**
   * redux 更换城市
   */
  listenUpdate() {
    let { text } = store.getState();
    this.getWeather(text);
    this.getDailyWeather(text);
  }

  componentDidMount() {
    let vm = this;
    vm.getWeather();
    vm.getDailyWeather();
  }
  

  renderCity() {
    if (this.state.location['province']) {
      return (
        <>
          <Breadcrumb separator=">" className="fs20">
            <BreadcrumbItem>{this.state.location.province}</BreadcrumbItem>
            <BreadcrumbItem>{this.state.location.city}</BreadcrumbItem>
          </Breadcrumb>
        </>
      );
    }
  }

  renderWeather() {
    if (this.state.weather['location'] && this.state.dailyWeather['daily']) {
      // let code = `../../assets/img/${this.state.weather.now.code}.png`;
      let code = require(`../../assets/img/${this.state.weather.now.code}.png`);
      let drop = this.state.dailyWeather.daily[0].precip;
      let dropImg = require('../../assets/img/drop.png');
      let windDire = require('../../assets/img/wind-dire.png');
      let wind = this.state.dailyWeather.daily[0].wind_direction;
      return (
        <>
          <div className="c-weather">
            <div className="c-weather-top">
              <div className="c-weather-top-number fs150">
                {this.state.weather.now.temperature} 
                <span>°</span>
              </div>
              <img src={code} alt="" className="c-weather-top-img" />
              <span className="c-weather-top-text">{this.state.weather.now.text}</span>
            </div>
            <div className="c-weather-center">
              <div className="c-weather-center-top">
                <div className="flex-c-null">
                  <img src={dropImg} alt="" />
                  <span className="c-weather-center-top-text">降水量{drop ? drop : '0.0'}</span>
                </div>
                <div className="flex-c-null">
                  <img src={windDire} alt="" />
                  <span className="c-weather-center-top-text">{wind}</span>
                </div>
              </div>
            </div>
            <div className="c-weather-bottom">
              {this.renderDailyWeather()}
            </div>
          </div>
        </>
      )
    }
  }

  renderDailyWeather() {
    return (
      <>
        <Table 
          pagination={false}
          dataSource={this.dataSource}
          columns={this.columns} />
      </>
    )
  }

  render() {
    return (
      <div className="c-page">
        <div className="c-nav">
            {this.renderCity()}
        </div>
        {this.renderWeather()}
      </div>
    )
  }
}
