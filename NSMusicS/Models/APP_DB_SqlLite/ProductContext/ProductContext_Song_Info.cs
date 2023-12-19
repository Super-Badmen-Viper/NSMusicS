using Microsoft.EntityFrameworkCore;
using NSMusicS;
using NSMusicS.Models;
using NSMusicS.Models.APP_DB_SqlLite.Category;
using NSMusicS.Models.APP_DB_SqlLite.Product;
using NSMusicS.Models.APP_DB_SqlLite.ProductContext;
using SkiaSharp;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Reflection.Emit;
using System.Text;
using System.Threading.Tasks;

namespace NSMusicS.Models.APP_DB_SqlLite.ProductContext
{
    public class ProductContext_Song_Info : DbContext
    {
        /// <summary>
        /// 歌单数据DB（Category_SongList_ID 一一对应）
        /// </summary>
        public DbSet<Category_SongList_Info> Category_SongList_Infos { get; set; }
        /// <summary>
        /// 歌曲数据DB（Category_SongList_ID 一一对应）
        /// </summary>
        public DbSet<Product_Song_Info> Product_Song_Infos { get; set; }


        public ProductContext_Song_Info(string temp)
        {
            db_name = temp;
        }

        string db_name = "ProductContext_Song_Info";
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite(
                "Data Source=" + db_name + ".db");
            optionsBuilder.UseLazyLoadingProxies();
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Category_SongList_ID 作为 Category_SongList_Info表的主键
            modelBuilder.Entity<Category_SongList_Info>()
                .HasKey(si => si.Category_SongList_ID);

            // Song_No 作为 Product_Song_Info表的主键
            modelBuilder.Entity<Product_Song_Info>()
                .HasKey(si => si.SongList_Name_AND_Song_Url);

            // 告诉 EF Core 使用 Category_SongList_ID 作为外键关联到 Category_SongList_Info 表的主键
            modelBuilder.Entity<Product_Song_Info>()
                .HasOne(psi => psi.category_SongList_Info)
                .WithMany(csi => csi.Product_Song_Infos)
                .HasForeignKey(psi => psi.Category_SongList_ID);

            base.OnModelCreating(modelBuilder);
        }


    }
}
