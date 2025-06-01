using Business;
using Domain;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Backend_Artisans.Authentication
{
    public class AuthenticationService
    {
        IConfiguration _config; // stocke les paramètres de configuration (clé, issuer, audience)
        IService _service;     // interface pour accéder aux données utilisateur

        // constructeur : initialise la config et le service
        public AuthenticationService(IConfiguration config, IService service)
        {
            _config = config;
            _service = service;
        }

        // génère et retourne un token JWT pour un utilisateur
        private string GenerateJSONWebToken(string username)
        {
            var secretKey = _config["Jwt:Key"]; // récupère la clé secrète dans la config
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)); // crée la clé de sécurité
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256); // crée les identifiants de signature

            // recherche de l'utilisateur par son nom
            var user = _service.GetUsers().FirstOrDefault(x => x.Username == username);
            if (user == null)
            {
                throw new Exception("User not found"); // si non trouvé, erreur
            }

            // préparation des claims (informations incluses dans le token)
            var claims = new[] {
                new Claim(JwtRegisteredClaimNames.Sub, username), // sujet = nom d'utilisateur
                new Claim("custom_info", "info"),             // claim personnalisé
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()), // identifiant unique du token
                new Claim(ClaimTypes.Role, user.Role),           // rôle de l'utilisateur
                new Claim("UserId", user.Id.ToString()),       // ID de l'utilisateur
            };

            var jwtIssuer = _config["Jwt:Issuer"];   // émetteur du token
            var jwtAudience = _config["Jwt:Audience"]; // destinataire du token

            // création du token JWT
            var token = new JwtSecurityToken(
                jwtIssuer,
                jwtAudience,
                claims,
                expires: DateTime.Now.AddMinutes(120), // expiration après 120 minutes
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token); // convertit en chaîne
        }

        // hache un mot de passe avec un sel (salt)
        private string HashPassword(string password, string salt)
        {
            var hash = Rfc2898DeriveBytes.Pbkdf2(
                password: Encoding.UTF8.GetBytes(password), // mot de passe en bytes
                salt: Encoding.UTF8.GetBytes(salt),         // sel en bytes
                iterations: 10,                             // nombre d'itérations
                hashAlgorithm: HashAlgorithmName.SHA512,    // algorithme SHA512
                outputLength: 10);                          // longueur du hash

            return Convert.ToHexString(hash); // conversion en hexadécimal
        }

        // enregistre un nouvel utilisateur
        public void RegisterUser(string username, string password, string role)
        {
            // vérifie que l'utilisateur n'existe pas déjà (insensible à la casse)
            if (_service.GetUsers().Any(user => user.Username.ToLower() == username.ToLower()))
            {
                throw new Exception("User already exist");
            }

            var salt = Guid.NewGuid().ToString();               // génère un sel unique
            var passwordHash = HashPassword(password, salt);    // hache le mot de passe

            var newUser = new User(GenerateNewId(), username, passwordHash, salt, role, false); // crée l'utilisateur
            _service.AddUser(newUser); // ajoute l'utilisateur au service
        }

        // authentifie un utilisateur et retourne un token si valide
        public string Login(string username, string password)
        {
            try
            {
                // recherche de l'utilisateur par nom
                var user = _service.GetUsers().FirstOrDefault(user => user.Username.ToLower() == username.ToLower());
                if (user == null)
                {
                    throw new Exception("Invalid userID or password"); // si non trouvé ou mot de passe incorrect
                }

                if (!user.Statut)
                {
                    throw new UnauthorizedAccessException("User exist but not approved"); // si pas approuvé
                }

                var passwordHash = HashPassword(password, user.Salt); // recrée le hash pour comparer
                if (user.Password != passwordHash)
                {
                    throw new UnauthorizedAccessException("Invalid userID or password"); // mot de passe incorrect
                }

                return GenerateJSONWebToken(username); // retourne le token JWT
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message); // remonte l'erreur
            }
        }

        // génère un nouvel ID utilisateur (max ID + 1)
        private int GenerateNewId()
        {
            if (_service.GetUsers().Count() == 0)
            {
                return 1; // si aucun utilisateur, ID=1
            }
            return _service.GetUsers().Max(u => u.Id) + 1; // sinon max+1
        }
    }
}
