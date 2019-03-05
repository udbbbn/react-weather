import React, { Component } from 'react';
import 'antd/lib/breadcrumb/style';
import {Breadcrumb} from 'antd';
import BreadcrumbItem from 'antd/lib/breadcrumb/BreadcrumbItem';
import jsonp from "jsonp";
import axios from 'axios';
import CryptoJS from 'crypto-js';

import './index.less';

interface location {
  address?: string,
  address_detail?: any,
  point?: object
}

export default class content extends Component<{}, {}> {
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
  public location:location = {};
  public weather:object = {};
  // 百度地图API
  private AK: string = "aUoynAD2ywl2KpslltOQ0etEFEsqzj9i";
  private baiduAPI: string = "http://api.map.baidu.com/location/ip?";

  constructor(props: object) {
    super(props);
    this.sig = encodeURIComponent(this.sig);
    this.str = this.str + "&sig=" + this.sig;
  }

  /**
   * 调用百度地图接口获取位置
   */
  getGeoLocation() {
    let vm:this = this;
    jsonp(`${this.baiduAPI}&ak=${this.AK}&coor=bd09ll`, (err, res) => {
      if (err) {
        alert('位置获取失败');
      } else {
        vm.location = res.content;
        vm.getWeather();
      }
    })
  }

  /**
   * 调用心知天气获取当前天气
   */
  getWeather() {
    let vm:this = this;
    let location = this.location.address_detail.city;
    let api:string = `${this.API}?location=${location}&${this.str}`;
    jsonp(`${api}`,(err, res) => {
      if (err) {
        alert('天气获取失败');
      } else {
        vm.weather = res.results[0];
        console.log(vm.weather);
      }
    });
  }

  componentDidMount() {
    this.getGeoLocation();
  }
  
  render() {
    return (
      <div className="c-page">
        <div className="c-nav">
          <Breadcrumb separator=">" className="fs20">
            <BreadcrumbItem>广东</BreadcrumbItem>
            <BreadcrumbItem>深圳</BreadcrumbItem>
          </Breadcrumb>
        </div>
      </div>
    )
  }
}
