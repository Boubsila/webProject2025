using Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using System.Text.Json;

namespace Data
{
    public class AppDbContext : DbContext
    {
        public virtual DbSet<Avis> Avis { get; set; }
        public virtual DbSet<Produit> Produits { get; set; }
        public virtual DbSet<User> User { get; set; }
        public virtual DbSet<Commande> Commandes { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            var listStringConverter = new ValueConverter<List<string>, string>(
                v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
                v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions)null)
            );

            modelBuilder.Entity<Avis>()
                .Property(a => a.Commentaire)
                .HasConversion(listStringConverter);

            base.OnModelCreating(modelBuilder);
        }
    }
}
