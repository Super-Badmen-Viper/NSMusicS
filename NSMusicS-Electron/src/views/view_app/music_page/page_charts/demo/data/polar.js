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
    ].sort((a, b) => b.play_count - a.play_count).slice(0, 10)
  },
  {
    type: "album",
    name: "专辑",
    items: [
      { name: "叶惠美", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-07-04" },
      { name: "范特西", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-07-03" },
      { name: "十一月的萧邦", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-07-02" },
      { name: "七里香", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "极25-07-01" },
      { name: "八度空间", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-30" },
      { name: "我很忙", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-29" },
      { name: "魔杰座", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-28" },
      { name: "跨时代", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-27" },
      { name: "十二新作", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-26" },
      { name: "哎呦，不错哦", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-25" }
    ].sort((a, b) => b.play_count - a.play_count).slice(0, 10)
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
    ].sort((a, b) => b.play_count - a.play_count).slice(0, 10)
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
    ].sort((a, b) => b.play_count - a.play_count).slice(0, 10)
  }
];

export default function getData(selectedCategory = "乐曲") {
  const category = dimensions.find(d => d.name === selectedCategory);
  if (!category) return {};

  const items = category.items;

  // 准备极坐标数据 - 三种分组类型
  const groups = {
    group1: { name: "高完播率", color: "#FF6B88" }, // 粉色
    group2: { name: "中完播率", color: "#36A2EB" }, // 蓝色
    group3: { name: "低完播率", color: "#FFCE56" }  // 黄色
  };

  const data = [];
  const groupData = {
    group1: [],
    group2: [],
    group3: []
  };

  const maxRadius = Math.max(...items.map(item => item.play_count)) * 1.2;

  // 准备散点数据
  items.forEach((item, index) => {
    const angle = (index * 360) / items.length; // 均匀分布的角度
    const completionRate = Math.round((item.play_complete_count / item.play_count) * 100);

    // 根据完播率分组
    let groupKey = "group3"; // 低完播率 (<50%)
    if (completionRate >= 70) groupKey = "group1"; // 高完播率
    else if (completionRate >= 50) groupKey = "group2"; // 中完播率

    const scatterData = {
      value: [angle, Math.random() * maxRadius], // 随机半径位置
      name: item.name,
      play_count: item.play_count,
      rating: item.rating,
      starred: item.starred,
      play_complete_count: item.play_complete_count,
      play_date: item.play_date,
      completion_rate: completionRate,
      symbolSize: 10 + Math.sqrt(item.play_count) * 2, // 点大小与播放次数相关
      symbol: "circle"
    };

    // 添加到对应分组
    groupData[groupKey].push(scatterData);
  });

  return {
    textStyle: {
      fontWeight: 600,
      fontSize: 14,
      color: "#333"
    },
    title: {
      text: `${selectedCategory}播放分布`,
      top: "5%",
      left: "center"
    },
    tooltip: {
      trigger: "item",
      backgroundColor: 'rgba(255,255,255,0.9)',
      borderWidth: 1,
      borderColor: '#E0E0E0',
      textStyle: {
        color: '#333',
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
          <div style="font-weight:bold;font-size:16px;color:#E53935;margin-bottom:8px;">${data.name}</div>
          <div style="display:flex;flex-direction:column;gap:4px;">
            <div>类型: ${selectedCategory}</div>
            <div>播放次数: <b>${data.play_count}</b> 次</div>
            <div>完整播放: ${data.play_complete_count} 次 (完播率: ${data.completion_rate}%)</div>
            <div>评分: ${data.rating} ${stars}</div>
            <div>收藏状态: ${starStatus}</div>
            <div>最近播放: ${data.play_date}</div>
          </div>
        `;
      }
    },
    legend: {
      show: true,
      right: "5%",
      top: "10%",
      orient: "vertical",
      data: [groups.group1.name, groups.group2.name, groups.group3.name],
      textStyle: {
        fontSize: 12
      },
      itemGap: 10
    },
    polar: {
      center: ["50%", "50%"],
      radius: "65%",
    },
    angleAxis: {
      clockwise: true,
      startAngle: 90, // 从12点方向开始
      min: 0,
      max: 360,
      axisLine: {
        show: true,
        lineStyle: {
          color: "#81C784" // 绿色边框
        }
      },
      axisLabel: {
        show: true,
        fontSize: 10
      },
      splitLine: {
        lineStyle: {
          color: "rgba(129, 199, 132, 0.5)" // 浅绿色辅助线
        }
      }
    },
    radiusAxis: {
      min: 0,
      max: maxRadius,
      axisLine: {
        show: true,
        lineStyle: {
          color: "#81C784" // 绿色边框
        }
      },
      axisLabel: {
        formatter: "{value}",
        fontSize: 10
      },
      splitLine: {
        lineStyle: {
          color: "rgba(129, 199, 132, 0.5)" // 浅绿色辅助线
        }
      }
    },
    series: [
      // 类型1 - 高完播率
      {
        name: groups.group1.name,
        type: "scatter",
        coordinateSystem: "polar",
        symbolSize: function(val) {
          return val[2]?.symbolSize || 20;
        },
        data: groupData.group1,
        itemStyle: {
          color: groups.group1.color
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 15,
            shadowColor: groups.group1.color,
            borderColor: "#fff",
            borderWidth: 2
          }
        }
      },
      // 类型2 - 中完播率
      {
        name: groups.group2.name,
        type: "scatter",
        coordinateSystem: "polar",
        symbolSize: function(val) {
          return val[2]?.symbolSize || 20;
        },
        data: groupData.group2,
        itemStyle: {
          color: groups.group2.color
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 15,
            shadowColor: groups.group2.color,
            borderColor: "#fff",
            borderWidth: 2
          }
        }
      },
      // 类型3 - 低完播率
      {
        name: groups.group3.name,
        type: "scatter",
        coordinateSystem: "polar",
        symbolSize: function(val) {
          return val[2]?.symbolSize || 20;
        },
        data: groupData.group3,
        itemStyle: {
          color: groups.group3.color
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 15,
            shadowColor: groups.group3.color,
            borderColor: "#fff",
            borderWidth: 2
          }
        }
      }
    ],
    animationDuration: 1000,
    grid: {
      top: "15%",
      bottom: "10%",
      containLabel: true
    }
  };
}