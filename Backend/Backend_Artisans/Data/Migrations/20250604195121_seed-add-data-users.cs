using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Data.Migrations
{
    /// <inheritdoc />
    public partial class seedadddatausers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Users
            migrationBuilder.InsertData(
                table: "User",
                columns: new[] { "Id", "Username", "Password", "Salt", "Role", "Statut" },
                values: new object[,]
                {
                    { 0, "su@petitshands.be", "07B5DE02396C34EF2E2E", "f4d3e1a5-ae9d-46a5-9325-44190689f781", "Admin", true },
                    { 1, "artinou@petitshands.be", "1C3C87222EE5E8E7C42C", "92abbf2e-ab23-4f06-aee0-e398672d7890", "artisan", true },
                    { 2, "leo.martin@petitshands.be", "B79DF54BA446C2B20349", "c9316967-e6d7-48d7-bc61-fdbf1f5dbb71", "client", true },
                    { 3, "livrapide@petitshands.be", "A0329287E32898C96867", "33756f96-b177-4332-a7fa-ae2578bdd9ce", "livreur", true }
                }
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Supprimer les utilisateurs
            migrationBuilder.DeleteData(table: "User", keyColumn: "Id", keyValue: 0);
            migrationBuilder.DeleteData(table: "User", keyColumn: "Id", keyValue: 1);
            migrationBuilder.DeleteData(table: "User", keyColumn: "Id", keyValue: 2);
            migrationBuilder.DeleteData(table: "User", keyColumn: "Id", keyValue: 3);


        }
    }
}
