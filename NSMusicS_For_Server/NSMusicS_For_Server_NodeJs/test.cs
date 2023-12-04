public void main(){
    string strRemoteFile = @"119.136.113.131/music/EXO-M - 上瘾 (Overdose).mp3";
    DownloadWebDavFile(strRemoteFile,"mozhi","Qwer1234");
}

protected byte[] DownloadWebDavFile(string remoteFile, string userName, string passWord)
{
    System.Net.WebProxy clsProxy = new System.Net.WebProxy();
    clsProxy.BypassProxyOnLocal = true;//获取或设置⼀个值，该值指⽰是否对本地地址不使⽤代理服务器
    string strPassUrl = remoteFile.Substring(0, remoteFile.IndexOf(@"\"));
    clsProxy.BypassList = new string[] { strPassUrl };//获取或设置⼀个地址数组，这些地址不使⽤代理服务器。
    Uri clsUri = new Uri(remoteFile);
    System.Net.WebRequest req = System.Net.WebRequest.Create(clsUri);//为指定的 URI ⽅案初始化新的 WebRequest 实例。
    req.Proxy = clsProxy; //设置代理
    req.Method = "GET";//获取⽅式为get
    req.Credentials = new System.Net.NetworkCredential(userName, passWord);//权限认证
    System.Net.WebResponse res = req.GetResponse();//返回对 Internet 请求的响应
    System.IO.Stream inStream = res.GetResponseStream();
    BinaryReader reader = new BinaryReader(inStream);
    byte[] btyChunk  =  new byte[4096];
    byte[] buffer = new byte[(int)res.ContentLength];//申请⽂件⼤⼩所需空间
    try
    {
        int count = 0;
        int i = 0;
        while ((count = reader.Read(btyChunk, 0, btyChunk.Length)) > 0)
        {
            Array.Copy(btyChunk, 0, buffer, i, count);//复制数据
            i = i + count;
        }
    }
    catch (Exception ex)
    {
        return null;
    }
    finally {
        if (reader != null)
        {
            reader.Close();
        }
    }
    return buffer;
}