using NSMusicS.Models.Song_Json_To_WebAPI;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace NSMusicS.Services
{
    public class Services_Web_API
    {
        private readonly HttpClient client;

        public Services_Web_API()
        {
            client = new HttpClient();
        }

        public List<MusicData> GetMusicData()
        {
            try
            {
                /*// 设置API地址
                string apiUrl = "http://api.example.com/music";

                // 发送GET请求获取数据
                HttpResponseMessage response = client.GetAsync(apiUrl).Result;

                // 检查请求是否成功
                response.EnsureSuccessStatusCode();

                // 读取响应内容并将JSON字符串转换为对象列表
                string json = response.Content.ReadAsStringAsync().Result;*/

                string json = "[{\"music_url\":\"https://tyst.migu.cn/public/product10th/productB35/2022/04/2015/2020%E5%B9%B407%E6%9C%8816%E6%97%A517%E7%82%B920%E5%88%86%E7%B4%A7%E6%80%A5%E5%86%85%E5%AE%B9%E5%87%86%E5%85%A5%E6%B5%B7%E8%9D%B6%E5%94%B1%E7%89%871%E9%A6%96/%E6%A0%87%E6%B8%85%E9%AB%98%E6%B8%85/MP3_128_16_Stero/6005860T60E150829.mp3\"}, " +
                    "{\"music_url\":\"https://tyst.migu.cn/public/productBe/productB01/2019/07/3118/2013%E5%B9%B412%E6%9C%8813%E6%97%A5%E7%B4%A7%E6%80%A5%E5%87%86%E5%85%A5%E6%B5%B7%E8%9D%B6%E5%94%B1%E7%89%879%E9%A6%96/%E6%A0%87%E6%B8%85%E9%AB%98%E6%B8%85/MP3_128_16_Stero/60058623088.mp3\"}]";
                List<MusicData> musicDataList = JsonConvert.DeserializeObject<List<MusicData>>(json);

                // 返回音乐数据列表
                return musicDataList;
            }
            catch (HttpRequestException e)
            {
                Console.WriteLine("Error: " + e.Message);
                return null;
            }
        }
    }
}
