import React, { Component } from 'react';
import 'antd/lib/breadcrumb/style';
import {Breadcrumb} from 'antd';
import BreadcrumbItem from 'antd/lib/breadcrumb/BreadcrumbItem';
import jsonp from "jsonp";
import CryptoJS from 'crypto-js';

import './index.less';

interface Istate {
  location: any, // 接口直接any
  weather: any
}

export default class content extends Component<{}, Istate> {
  // 知心天气API
  private API:string = "https://api.seniverse.com/v3/weather/now.json";
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
  // 百度地图API
  private AK: string = "aUoynAD2ywl2KpslltOQ0etEFEsqzj9i";
  private baiduAPI: string = "http://api.map.baidu.com/location/ip?";

  constructor(props: object) {
    super(props);
    this.sig = encodeURIComponent(this.sig);
    this.str = this.str + "&sig=" + this.sig;
    this.state = {
      location: {},
      weather: {}
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
      }
    })
  }

  /**
   * 调用心知天气获取当前天气
   */
  getWeather() {
    let vm:this = this;
    let location = vm.state.location.address_detail.city;
    let api:string = `${this.API}?location=${location}&${this.str}`;
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
    if (this.state.weather['location']) {
      let code = `/src/assets/img/${this.state.weather.now.code}.png`;
      return (
        <>
          <div className="c-weather">
            <div className="c-weather-top">
              <div className="c-weather-top-number fs150">
                {this.state.weather.now.temperature} 
                <span>°</span>
              </div>
              <img src={code} alt="" className="c-weather-top-img" />
            </div>
          </div>
        </>
      )
    }
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
