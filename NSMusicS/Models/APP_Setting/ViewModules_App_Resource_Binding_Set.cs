using CommunityToolkit.Mvvm.Input;
using GalaSoft.MvvmLight;
using NSMusicS.Services.Services_For_API_GetResult;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static NSMusicS.Models.Servies_For_API_Info.API_Song_Info;

namespace NSMusicS.Models.APP_Setting
{
    public class ViewModules_App_Resource_Binding_Set : ViewModelBase
    {
        private static ViewModules_App_Resource_Binding_Set This_Class { get; set; }
        public static ViewModules_App_Resource_Binding_Set Retuen_This()
        {
            This_Class = Return_This_CLass();
            return This_Class;
        }
        private static ViewModules_App_Resource_Binding_Set Return_This_CLass()
        {
            if (This_Class == null)
                This_Class = new ViewModules_App_Resource_Binding_Set();
            return This_Class;
        }

        public ViewModules_App_Resource_Binding_Set()
        {
            Resources_Set_Options = new Resources_App_Set_Option();

            RefCommand_Lyic = new RelayCommand(async () =>
            {

            });
        }

        /// <summary>
        /// 触发事件 歌词属性更改
        /// </summary>
        public RelayCommand RefCommand_Lyic { get; set; }


        /// <summary>
        /// 应用属性 INotifyPropertyChanged接口已实现
        /// </summary>
        private Resources_App_Set_Option resources_Set_Option;
        public Resources_App_Set_Option Resources_Set_Options
        {
            get { return resources_Set_Option; }
            set { resources_Set_Option = value; RaisePropertyChanged(); }
        }
    }
}
