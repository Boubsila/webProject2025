using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Data.Migrations
{
    /// <inheritdoc />
    public partial class seedadddataproduct : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Produits
            migrationBuilder.InsertData(
                table: "Produits",
                columns: new[] { "Id", "Nom", "Description", "Prix", "Categorie", "Image", "Quantite", "ArtisanName", "Statut" },
                values: new object[,] {
                    { 1, "Vase traditionnel", "Vase décoratif au style intemporel, parfait pour embellir tout espace de vie.", 75, "Poterie et Céramique", "/images/produits/vase1.png", 50, "artinou@petitshands.be", "approved" },
                    { 2, "Tapis design", "Pièce textile à motifs soignés, idéale pour compléter votre décoration.", 1175, "Tissage et Tapis", "/images/produits/tapis1.png", 10, "artinou@petitshands.be", "approved" },
                    { 3,"Lanterne charmante","Lanterne d’ambiance qui enrichit votre décoration avec subtilité.",170,"Autres","/images/produits/laterne2.png",40,"artinou@petitshands.be", "approved" }


                }



             );

        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Supprimer les produits
            migrationBuilder.DeleteData(table: "Produits", keyColumn: "Id", keyValue: 1);
            migrationBuilder.DeleteData(table: "Produits", keyColumn: "Id", keyValue: 2);
            migrationBuilder.DeleteData(table: "Produits", keyColumn: "Id", keyValue: 3);
        }
    }
}
