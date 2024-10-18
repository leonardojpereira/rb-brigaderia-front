using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Project.Domain.Entities;

namespace Project.Infrastructure.Data.Configurations
{
    internal class RecipeConfiguration : IEntityTypeConfiguration<Recipe>
    {
        public void Configure(EntityTypeBuilder<Recipe> builder)
        {
            builder.ToTable("T_RECIPE");

            builder.HasKey(r => r.Id);

            builder.Property(r => r.Id)
                .HasColumnType("uniqueidentifier")
                .HasColumnName("PK_ID_RECIPE")
                .ValueGeneratedOnAdd();

            builder.Property(r => r.Nome)
                .HasColumnName("TX_NOME")
                .IsRequired();

            builder.Property(r => r.Descricao)
                .HasColumnName("TX_DESCRICAO");

            // Relacionamento com RecipeIngredient (1 Recipe tem muitos RecipeIngredients)
            builder.HasMany(r => r.Ingredientes)
                .WithOne(ri => ri.Recipe)
                .HasForeignKey(ri => ri.RecipeId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}