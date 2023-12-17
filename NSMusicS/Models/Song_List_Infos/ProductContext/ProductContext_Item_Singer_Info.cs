using Microsoft.EntityFrameworkCore;
using NSMusicS.Models.Song_List_Infos.Category;
using NSMusicS.Models.Song_List_Infos.Product;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NSMusicS.Models.Song_List_Infos.ProductContext
{
    public class ProductContext_Item_Singer_Info : DbContext
    {
        /// <summary>
        /// 歌单数据DB（Category_SongList_ID 一一对应）
        /// </summary>
        public DbSet<Category_SingerList_Info> Category_SingerList_Infos { get; set; }
        /// <summary>
        /// 歌曲数据DB（Category_SongList_ID 一一对应）
        /// </summary>
        public DbSet<Product_Singer_Info> Product_Singer_Infos { get; set; }

        public ProductContext_Item_Singer_Info(string temp) 
        {
            db_name = temp;
        }

        string db_name = "ProductContext_Singer_Info";
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite(
                "Data Source="+ db_name + ".db");
            optionsBuilder.UseLazyLoadingProxies();
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // 主键
            modelBuilder.Entity<Category_SingerList_Info>()
                .HasKey(si => si.Category_SingerList_ID);

            // 主键
            modelBuilder.Entity<Product_Singer_Info>()
                .HasKey(si => si.Album_Performer_Name_AND_Album_Name);

            // 告诉 EF Core 使用 Album_Performer_Name 作为外键关联到 Category_SingerList_Info 表的主键
            modelBuilder.Entity<Product_Singer_Info>()
                .HasOne(psi => psi.category_SingerList_Info)
                .WithMany(csi => csi.Product_Singer_Infos)
                .HasForeignKey(psi => psi.Category_SingerList_ID);

            base.OnModelCreating(modelBuilder);
        }
    }
}
