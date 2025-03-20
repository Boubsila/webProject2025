using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Backend_Artisans.Authentication
{
    public class AuthenticationService
    {

        //Liste des utilisateurs : 
        private static readonly List<User> users = new List<User> {
            new User("user1","829792F8543443A91F7E","Sunday","Admin"),  //test
            new User("user2","EE1D043DE283E12CD10A","Sunday","User"), //password
            new User("user3","A06EE0913A1EBFCE55EF","Sunday","") //secret
        };

        // Service pour récupérer les infos dans notre configuration appsetting
        IConfiguration _config;
        public AuthenticationService(IConfiguration config)
        {
            _config = config;
        }


        // Generer un Token 
        private string GenerateJSONWebToken(string username)
        {
            var secretKey = _config["Jwt:Key"];
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[] {
                new Claim(JwtRegisteredClaimNames.Sub, username),
                new Claim("custom_info", "info"),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim (ClaimTypes.Role, users.FirstOrDefault(x=>x.Username==username).Role),
                //new Claim("email", users.FirstOrDefault(x => x.Username == username).Email) // Ajout d'une claim personnalisée "email"

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


        // Hasher le password 
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

        public void RegisterUser(string username, string password,string role)
        {

            if (users.Any(user => user.Username.ToLower() == username.ToLower()))
            {
                throw new Exception("User already exist");
            }
            var salt = DateTime.Now.ToString("dddd"); // get the day of week. Ex: Sunday
            var passwordHash = HashPassword(password, salt);
            var newUser = new User(username, passwordHash, salt,role);
            users.Add(newUser);
        }

        public string Login(string username, string password)
        {
            var user = users.FirstOrDefault(user => user.Username.ToLower() == username.ToLower()) ??
                            throw new Exception("Login failed; Invalid userID or password");

            var passwordHash = HashPassword(password, user.Salt);
            if (user.Password == passwordHash)
            {
                var token = GenerateJSONWebToken(username);
                return token;
            }
            throw new Exception("Login failed; Invalid userID or password");
        }

        public List<User> GetUsers()
        {
            return users;
        }

    
    }

    public class User
    {
        public string Username { get; set; }

        public User(string username, string password, string salt,string role)
        {
            Username = username;
            Password = password;
            Salt = salt;
            Role = role;
            
        }

        public User(string email, string password)
        {
            Username = email;
            Password = password;
        }

        public string Password { get; set; }
        public string Salt { get; set; }
        public string Role { get; set; }
       
    }

}
