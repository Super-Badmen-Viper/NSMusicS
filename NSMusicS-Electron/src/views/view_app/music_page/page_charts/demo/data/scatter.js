function random() {
  return Math.round(300 + Math.random() * 700) / 10;
}

export const dimensions = [
  {
    type: "media_file",
    name: "乐曲",
    items: [
      { name: "七里香", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-07-07" },
      { name: "以父之名", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-07-06" },
      { name: "晴天", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-07-05" },
      { name: "夜曲", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-07-04" },
      { name: "青花瓷", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-07-03" },
      { name: "稻香", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-07-02" },
      { name: "双截棍", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-07-01" },
      { name: "简单爱", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-30" },
      { name: "听妈妈的话", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-29" },
      { name: "东风破", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-28" }
]
},
{
  type: "album",
  name: "专辑",
  items: [
    { name: "叶惠美", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-07-04" },
    { name: "范特西", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-07-03" },
    { name: "十一月的萧邦", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-07-02" },
    { name: "七里香", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-07-01" },
    { name: "八度空间", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-30" },
    { name: "我很忙", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-29" },
    { name: "魔杰座", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-28" },
    { name: "跨时代", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-27" },
    { name: "十二新作", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-26" },
    { name: "哎呦，不错哦", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-25" }
  ]
},
{
  type: "artist",
  name: "艺术家",
  items: [
    { name: "周杰伦", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-07-01" },
    { name: "林俊杰", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-30" },
    { name: "陈奕迅", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-29" },
    { name: "邓紫棋", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-28" },
    { name: "薛之谦", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-27" },
    { name: "李荣浩", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-26" },
    { name: "王力宏", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-25" },
    { name: "张杰", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-24" },
    { name: "华晨宇", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-23" },
    { name: "毛不易", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-22" }
  ]
},
{
  type: "media_cue",
  name: "光盘",
  items: [
    { name: "经典CD-001", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-28" },
    { name: "怀旧CD-002", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-27" },
    { name: "摇滚CD-003", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-26" },
    { name: "流行CD-004", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-25" },
    { name: "电子CD-005", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-24" },
    { name: "爵士CD-006", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-23" },
    { name: "古典CD-007", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-22" },
    { name: "民谣CD-008", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-21" },
    { name: "蓝调CD-009", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-20" },
    { name: "乡村CD-010", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-19" }
  ]
}
];

export default function getData(selectedCategory = "乐曲") {
  // 获取选中的维度数据
  const category = dimensions.find(d => d.name === selectedCategory);
  if (!category) return {};

  const items = category.items;

  // 准备散点图数据
  const scatterData = items.map(item => {
    const completionRate = Math.round((item.play_complete_count / item.play_count) * 100);

    return {
      name: item.name,
      value: [item.play_count, completionRate, parseFloat(item.rating)], // [播放次数, 完播率, 评分]
      play_count: item.play_count,
      rating: item.rating,
      starred: item.starred,
      play_complete_count: item.play_complete_count,
      play_date: item.play_date,
      completion_rate: completionRate
    };
  });

  // 计算最大播放次数和完播率，用于坐标轴范围
  const maxPlayCount = Math.max(...items.map(item => item.play_count)) * 1.1;
  const maxCompletionRate = 110; // 完播率最大110% (超过100%的情况)

  return {
    grid: {
      top: "15%",
      right: "12%",
      left: "8%",
      bottom: "5%",
      containLabel: true // 确保标签包含在网格内[1,6](@ref)
    },
    textStyle: {
      fontWeight: 600,
      fontSize: 14
    },
    title: {
      text: `${selectedCategory}播放数据分析`,
      top: "5%",
      left: "center"
    },
    tooltip: {
      trigger: "item",
      backgroundColor: 'rgba(50,50,50,0.9)',
      textStyle: {
        color: '#fff',
        fontSize: 14
      },
      extraCssText: 'border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);',
      formatter: function(params) {
        const data = params.data;
        const starStatus = data.starred
            ? '<span style="color:#67C23A;">✓ 已收藏</span>'
            : '<span style="color:#F56C6C;">✗ 未收藏</span>';

        // 生成星级评分（1-5星）
        const stars = '★'.repeat(Math.floor(data.rating)) + '☆'.repeat(5 - Math.floor(data.rating));

        return `
          <div style="font-weight:bold;font-size:16px;margin-bottom:8px;">${data.name}</div>
          <div style="display:flex;flex-direction:column;gap:4px;">
            <div>类型: ${selectedCategory}</div>
            <div>播放次数: ${data.play_count} 次</div>
            <div>完整播放: ${data.play_complete_count} 次 (完播率: ${data.completion_rate}%)</div>
            <div>评分: ${data.rating} ${stars}</div>
            <div>收藏状态: ${starStatus}</div>
            <div>最近播放: ${data.play_date}</div>
          </div>
        `;
      }
    },
    legend: {
      top: "6%",
      right: "5%",
      data: [selectedCategory]
    },
    xAxis: {
      type: "value",
      name: "播放次数",
      nameLocation: "end",
      nameGap: 10,
      nameTextStyle: {
        padding: [5, 0, 0, 0]
      },
      min: 0,
      max: maxPlayCount,
      splitLine: {
        lineStyle: {
          type: "dashed",
          color: "rgba(200, 200, 200, 0.3)"
        }
      }
    },
    yAxis: {
      type: "value",
      name: "完播率 (%)",
      nameLocation: "end",
      nameGap: 25,
      min: 0,
      max: maxCompletionRate,
      axisLabel: {
        formatter: "{value}%"
      },
      splitLine: {
        lineStyle: {
          type: "dashed",
          color: "rgba(200, 200, 200, 0.3)"
        }
      }
    },
    // 添加视觉映射组件
    visualMap: {
      show: true,
      top: "65px",
      right: "20px",
      seriesIndex: 0,
      dimension: 2, // 使用第三个维度(评分)映射
      min: 0,
      max: 5,
      text: ["高评分", "低评分"],
      calculable: true,
      inRange: {
        color: ["#5470c6", "#91cc75", "#fac858", "#ee6666"]
      },
      textStyle: {
        color: '#333'
      }
    },
    series: [
      {
        name: selectedCategory,
        data: scatterData,
        type: "scatter",
        symbolSize: function(data) {
          // 根据评分决定点的大小 (0-5分映射为8-28大小)
          return 8 + data[2] * 7;
        },
        itemStyle: {
          color: function(params) {
            // 根据收藏状态设置颜色
            return params.data.starred ? "#ee6666" : "#5470c6";
          },
          borderColor: "#fff",
          borderWidth: 1,
          shadowBlur: 8,
          shadowColor: "rgba(0, 0, 0, 0.3)",
          shadowOffsetY: 3
        },
        emphasis: {
          label: {
            show: true,
            formatter: "{b}",
            position: "top",
            fontSize: 12,
            backgroundColor: "rgba(255,255,255,0.8)",
            padding: [3, 5],
            borderRadius: 4
          },
          itemStyle: {
            shadowBlur: 12,
            shadowColor: "rgba(0, 0, 0, 0.5)",
            borderWidth: 2
          }
        }
      }
    ]
  };
}