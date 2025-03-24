using Data;
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
        // Liste statique pour stocker les utilisateurs (pour le développement)
        //private static List<User> users = new List<User>
        //{
        //    new User ( 1,  "admin@artisans.be",  "admin", Guid.NewGuid().ToString(), "Admin",  true ),
        //    new User ( 2, "artisan@artisans.be", "artisan", Guid.NewGuid().ToString(), "artisan", false ),
        //    new User ( 3, "c@artisans.be", "3892C265A1C4F640E7C7", Guid.NewGuid().ToString(), "client", true ),
        //    new User ( 4,"admin2@artisans.be","4326FACBD8C1467C6FC7","f6893125-485c-4439-a443-d4600865f788","Admin",true)
        //};

        IConfiguration _config;
        IRepo _repo;

        public AuthenticationService(IConfiguration config,IRepo repo)
        {
            _config = config;

            //migration test
            _repo = repo;

        }

        private string GenerateJSONWebToken(string username)
        {
            var secretKey = _config["Jwt:Key"];
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[] {
                new Claim(JwtRegisteredClaimNames.Sub, username),
                new Claim("custom_info", "info"),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),

                //migration test
                new Claim (ClaimTypes.Role, _repo.GetUsers().FirstOrDefault(x=>x.Username==username)?.Role),
            };

            var jwtIssuer = _config["Jwt:Issuer"];
            var jwtAudience = _config["Jwt:Audience"];

            var token = new JwtSecurityToken(
                jwtIssuer,
                jwtAudience,
                claims,
                expires: DateTime.Now.AddMinutes(120),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string HashPassword(string password, string salt)
        {
            var hash = Rfc2898DeriveBytes.Pbkdf2(
                password: Encoding.UTF8.GetBytes(password),
                salt: Encoding.UTF8.GetBytes(salt),
                iterations: 10,
                hashAlgorithm: HashAlgorithmName.SHA512,
                outputLength: 10);

            return Convert.ToHexString(hash);
        }

        public void RegisterUser(string username, string password, string role)
        {
            //migration test
            if (_repo.GetUsers().Any(user => user.Username.ToLower() == username.ToLower()))
            {
                throw new Exception("User already exist");
            }

            var salt = Guid.NewGuid().ToString();
            var passwordHash = HashPassword(password, salt);

            var newUser = new User(GenerateNewId(), username, passwordHash, salt, role, false);
            //migration test
            _repo.AddUser(newUser);
        }

        public string Login(string username, string password)
        {
            try
            {
                //migration test
                var user = _repo.GetUsers().FirstOrDefault(user => user.Username.ToLower() == username.ToLower());

                if (user == null)
                {
                    throw new Exception("Invalid userID or password");
                }

                if (!user.Statut)
                {
                    throw new UnauthorizedAccessException("User exist but not approved");
                }

                var passwordHash = HashPassword(password, user.Salt);

                if (user.Password != passwordHash)
                {
                    throw new UnauthorizedAccessException("Invalid userID or password");
                }

                return GenerateJSONWebToken(username);
            }
          
            catch (Exception ex)
            {
                
                throw new Exception(ex.Message); // Message d'erreur générique
            }
        }

        //public List<User> GetUsers()
        //{
        //    return users;
        //}

        private int GenerateNewId()
        {
            //migration test
            if (_repo.GetUsers().Count() == 0)
            {
                return 1;
            }
            return _repo.GetUsers().Max(u => u.Id) + 1;
        }
    }

    //public class User
    //{
    //    public int Id { get; set; }
    //    public string Username { get; set; }
    //    public string Password { get; set; }
    //    public string Salt { get; set; }
    //    public string Role { get; set; }
    //    public bool Statut { get; set; }

    //    public User(int id, string username, string password, string salt, string role, bool statut)
    //    {
    //        Id = id;
    //        Username = username;
    //        Password = password;
    //        Salt = salt;
    //        Role = role;
    //        Statut = statut;
    //    }
    //}
}