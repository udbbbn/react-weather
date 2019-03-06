import React, { Component } from 'react';
import 'antd/lib/breadcrumb/style';
import 'antd/lib/table/style';
import {Breadcrumb, Table} from 'antd';
import BreadcrumbItem from 'antd/lib/breadcrumb/BreadcrumbItem';
import jsonp from "jsonp";
import CryptoJS from 'crypto-js';

import './index.less';

interface Istate {
  location: any, // 接口直接any
  weather: any,
  dailyWeather: any
}

export default class content extends Component<{}, Istate> {
  // 知心天气API
  private API:string = "https://api.seniverse.com/v3/weather/";
  // private userId = "UDBA707165";
  private KEY:string  = "6caevcsvwkmtunzl";
  private uid:string  = "UDBA707165";
  private ts:number = Math.floor((new Date()).getTime() / 1000);// 获取当前时间戳
  private str:string  = `ts=${this.ts}&uid=${this.uid}`;// 构造验证参数字符串
  // 使用 HMAC-SHA1 方式，以 API 密钥（key）对上一步生成的参数字符串（raw）进行加密
  // 并将加密结果用 base64 编码，并做一个 urlencode，得到签名 sig
  private sig:string  = CryptoJS.HmacSHA1(this.str, this.KEY).toString(CryptoJS.enc.Base64);
  // private sig = encodeURIComponent(this.sig);
  public location:object = {};
  public weather:object = {};
  public dailyWeather:object = {};
  // 百度地图API
  private AK: string = "aUoynAD2ywl2KpslltOQ0etEFEsqzj9i";
  private baiduAPI: string = "http://api.map.baidu.com/location/ip?";

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
      location: {},
      weather: {},
      dailyWeather: {}
    }
  }

  /**
   * 获取当前ip的地理位置
   */
  getGeoLocation() {
    let vm:this = this;
    jsonp(`${this.baiduAPI}&ak=${this.AK}&coor=bd09ll`, (err, res) => {
      if (err) {
        alert('位置获取失败');
      } else {
        vm.setState({
          location: res.content
        })
        console.log(vm.state.location);
        vm.getWeather();
        vm.getDailyWeather();
      }
    })
  }

  /**
   * 调用心知天气获取当前天气
   */
  getWeather() {
    let vm:this = this;
    let location:string = vm.state.location.address_detail.city;
    let apiRouter:string = "now.json";
    let api:string = `${this.API}${apiRouter}?location=${location}&${this.str}&start=0&days=5`;
    jsonp(`${api}`,(err, res) => {
      if (err) {
        alert('天气获取失败');
      } else {
        vm.setState({
          weather: res.results[0]
        })
        console.log(vm.state.weather);
      }
    });
  }

  /**
   * 心知天气-获取未来3天天气
   */
  getDailyWeather() {
    let vm:this = this;
    let location = vm.state.location.address_detail.city;
    let apiRouter:string = "daily.json";
    let api:string = `${this.API}${apiRouter}?location=${location}&${this.str}`;
    jsonp(`${api}`,(err, res) => {
      if (err) {
        alert('未来天气获取失败');
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
      res.push({
        key: index,
        date: el.date,
        temp: `${el.low}°/${el.high}°`,
        weather: hour === '上午' ? el.text_day : el.text_night,
        wind_dire: el.wind_direction,
        wind_speed: el.wind_speed + '级',
        wind_scale: el.wind_scale + '级'
      })
    });
    return res
  }

  componentDidMount() {
    this.getGeoLocation();
  }
  

  renderCity() {
    if (this.state.location['address_detail']) {
      return (
        <>
          <Breadcrumb separator=">" className="fs20">
            <BreadcrumbItem>{this.state.location.address_detail.province}</BreadcrumbItem>
            <BreadcrumbItem>{this.state.location.address_detail.city}</BreadcrumbItem>
          </Breadcrumb>
        </>
      );
    }
  }

  renderWeather() {
    if (this.state.weather['location'] && this.state.dailyWeather['daily']) {
      let code = `/src/assets/img/${this.state.weather.now.code}.png`;
      let drop = this.state.dailyWeather.daily[0].precip;
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
                  <img src="/src/assets/img/drop.png" alt="" />
                  <span className="c-weather-center-top-text">降水量{drop ? drop : '0.0'}</span>
                </div>
                <div className="flex-c-null">
                  <img src="/src/assets/img/wind-dire.png" alt="" />
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
