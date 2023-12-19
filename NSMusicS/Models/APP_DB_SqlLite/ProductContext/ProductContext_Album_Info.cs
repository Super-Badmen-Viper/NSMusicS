using Microsoft.EntityFrameworkCore;
using NSMusicS;
using NSMusicS.Models;
using NSMusicS.Models.APP_DB_SqlLite.Category;
using NSMusicS.Models.APP_DB_SqlLite.Product;
using NSMusicS.Models.APP_DB_SqlLite.ProductContext;
using NSMusicS.Models.Song_List_Infos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NSMusicS.Models.APP_DB_SqlLite.ProductContext
{
    public class ProductContext_Album_Info : DbContext
    {
        /// <summary>
        /// 歌单数据DB（Category_SongList_ID 一一对应）
        /// </summary>
        public DbSet<Category_AlbumList_Info> Category_AlbumList_Infos { get; set; }
        /// <summary>
        /// 歌曲数据DB（Category_SongList_ID 一一对应）
        /// </summary>
        public DbSet<Product_Album_Info> Product_Album_Infos { get; set; }

        public ProductContext_Album_Info(string temp)
        {
            db_name = temp;
        }

        string db_name = "ProductContext_Album_Info";
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite(
                "Data Source=" + db_name + ".db");
            optionsBuilder.UseLazyLoadingProxies();
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Category_SongList_ID 作为 Category_SongList_Info表的主键
            modelBuilder.Entity<Category_AlbumList_Info>()
                .HasKey(si => si.Category_AlbumList_ID);

            // Song_No 作为 Product_Song_Info表的主键
            modelBuilder.Entity<Product_Album_Info>()
                .HasKey(si => si.SongList_Performer_Album_Name);

            // 告诉 EF Core 使用 Category_SongList_ID 作为外键关联到 Category_SongList_Info 表的主键
            modelBuilder.Entity<Product_Album_Info>()
                .HasOne(psi => psi.category_AlbumList_Info)
                .WithMany(csi => csi.Product_Album_Infos)
                .HasForeignKey(psi => psi.Category_AlbumList_ID);

            base.OnModelCreating(modelBuilder);
        }
    }
}
