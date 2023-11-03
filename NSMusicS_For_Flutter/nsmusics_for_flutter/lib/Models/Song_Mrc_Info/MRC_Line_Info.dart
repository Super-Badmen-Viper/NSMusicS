/// <summary>
/// 歌词行信息及歌词字符信息
/// </summary>
class MRC_Line_Info
{
  ///当前 歌词行行数(int)
  int This_MRC_Line = 0;
  ///当前 歌词行开始时间(int)
  int This_MRC_Start_Time = 0;
  ///当前 歌词行持续时间(int)
  int This_MRC_Duration = 0;

  ///String
  String String_Lrc_Line = "";

  ///当前 歌词行所有字节的数量(int)
  int Int_MoreByte_Nums = 0;
  ///当前 歌词行所有字节的 字节内容(ArrayList)
  List<String> Array_Morebyte_Text = [];
  ///当前 歌词行字节的动画 开始时间(ArrayList)
  List<String> Array_Morebyte_BeginTime = [];
  ///当前 歌词行字节的动画 持续时间(ArrayList)
  List<String> Array_Morebyte_Duration = [];
}