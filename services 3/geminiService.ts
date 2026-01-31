
// Replaced GoogleGenAI with local mock generation
// import { GoogleGenAI } from "@google/genai";

const MOCK_EVENTS = [
  "警告：黑海市第4区检测到高能现实扭曲反应。",
  "系统监测：当前世界线变动率超过 0.4%。",
  "广播：不明生物正在下水道网络快速移动，请远离井盖。",
  "天气预报：今夜将有高腐蚀性酸雨，请检查居住舱密封性。",
  "拦截到加密通讯：'它们...在墙壁里...'",
  "系统提示：检测到微量精神污染波段，建议定期服用San值药剂。",
  "白鲸市观测站报告：极夜极光中出现了类似眼睛的图案。",
  "紧急通告：一名代行者在闹市区失控，已派遣清理小队。",
  "数据库错误：部分历史档案已被篡改。",
  "未知信号正在尝试接入你的神经插槽... 连接被防火墙阻断。",
  "深红之土含氧量微弱下降，原因不明。",
  "收到来自[数据删除]的求救信号，坐标无法解析。"
];

export const generateWorldEvent = async (survivors: number, avgSanity: number): Promise<string> => {
  // Simulate network/generation delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Return a random event from the mock list
  const randomIndex = Math.floor(Math.random() * MOCK_EVENTS.length);
  return MOCK_EVENTS[randomIndex];
};
