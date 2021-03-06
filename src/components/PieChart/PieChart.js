import React from 'react'
import './PieChart.css'
import TopBar from '../TopBar/TopBar';
import axios from 'axios'
import echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';
import 'echarts-wordcloud'
import EventBus from '../../utils/EventBus'

export default class PieChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            emotionData: [], //
            wordData: [],
            id: '2020032013163140',
        }
    }

    componentDidMount() {
        EventBus.addListener('weibo-click', (id) => {
            this.setState({ id: id }, () => {
                this.uploadData(this.state.id)
            })
        })
        EventBus.addListener('rank-click', (id) => {
            this.setState({ id: id }, () => {
                this.uploadData(this.state.id)
            })
        })
    }

    uploadData(id) {
        axios.post("http://120.27.243.210:3000/getWeibo",
            //参数列表
            {
                'id': id
            }
        ).then((res) => {
            //console.log(res);
            let e_rawdata = res.data.result.emotion;
            let w_rawdata = res.data.result.cloud;
            //console.log(rawdata);
            let emotionData = this.emotionDataParse(e_rawdata);
            let wordData = this.wordDataParse(w_rawdata);
            //console.log(data);
            this.setState({
                emotionData: emotionData,
                wordData: wordData
            }, () => {
                console.log(this.state);
            })
        })
    }

    emotionDataParse(rawdata) {
        let data = [];
        let name = '';
        for (let i in rawdata) {
            switch (i) {
                case 'positive':
                    name = '积极';
                    break;
                case 'negative':
                    name = '消极';
                    break;
                case 'neutral':
                    name = '中性';
                    break;
            }
            //console.log(i);
            //console.log(rawdata[i]);
            data.push({ name: name, value: rawdata[i] })
        }
        return data;
    }

    wordDataParse(rawdata) {
        let data = [];
        for (let i in rawdata) {
            //console.log(i);
            //console.log(rawdata[i]);
            data.push({ name: i, value: rawdata[i] })
        }
        return data;
    }

    getOption = () => {
        let maskImage = new Image();
        maskImage.src = '/mask.png';

        let option = {
            backgroundColor: '#3a3a38',
            color: ['#ebe57a', '#9e9e9e', '#957bbf'],
            tooltip: {
                trigger: 'item',
            },
            legend: {
                textStyle: {
                    color: 'white',
                },
                orient: 'vertical',
                right: 10,
                top: 10,
                data: ['积极', '中性', '消极']
            },
            series: [
                {
                    name: '用户情绪',
                    // type: 'pie',
                    // radius: '55%',
                    // center: ['50%', '60%'],               
                    // // data: [
                    // //     {value: 30, name: '积极'},
                    // //     {value: 10, name: '中性'},
                    // //     {value: 10, name: '消极'}
                    // // ],
                    tooltip: {
                        formatter: '{b} : {c} ({d}%)'
                    },
                    data: this.state.emotionData,
                    type: 'pie',
                    radius: ['64%', '79%'], //环图
                    avoidLabelOverlap: false,
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        },
                    },
                    labelLine: {
                        show: false
                    },
                }, {
                    type: 'wordCloud',
                    roam: true,
                    gridSize: 3,
                    sizeRange: [18, 28],
                    maskImage: maskImage,
                    rotationRange: [-40, 40],
                    //rotationRange: [-45, 0, 45, 90],
                    rotationStep: 30,
                    shape: 'circle',                
                    drawOutOfBound:false,
                    textStyle: {
                        normal: {
                            color: function () {
                                // var colors = ['#fda67e', '#81cacc', '#cca8ba', "#88cc81", "#82a0c5", '#fddb7e', '#735ba1', '#bda29a', '#6e7074', '#546570', '#c4ccd3'];
                                var colors = ['#eecf79', '#fba57d', '#80c4c5', '#bda39b', '#86a7ce', '#90caf9', '#ff5252', '#ffff8d',]
                                return colors[parseInt(Math.random() * 7)];
                            }
                        },
                        emphasis: {
                            shadowBlur: 10,
                            shadowColor: '#333'
                        }
                    },
                    left: 'center',
                    top: 0,
                    width: '100%',
                    height: '100%',
                    data:this.state.wordData,
                    // data: [
                    //     { name: '湖北', value: 120 },
                    //     { name: '武汉', value: 102 },
                    //     { name: '疫情', value: 80 },
                    //     { name: '新冠', value: 70 },
                    //     { name: '新增病例', value: 61 }
                    // ],
                }
            ]
        };
        return option
    }

    render() {
        return (

            <div id='Pie' style={{ height: '90%' }}>
                <TopBar>
                    <span id='top-title'>评论情绪分析</span>
                </TopBar>
                <ReactEcharts option={this.getOption()} />
            </div>
        )
    }
}