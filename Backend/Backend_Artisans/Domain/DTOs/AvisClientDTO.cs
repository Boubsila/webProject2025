using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.DTOs
{
    public class AvisClientDto
    {
        public string NumeroCommande { get; set; }
        public string ProduitName { get; set; }
        public string ClientName { get; set; }
        public string ArtisanName { get; set; }
        public int Note { get; set; }
        public string CommentaireClient { get; set; }
        public string DateAvis { get; set; }
    }
}
