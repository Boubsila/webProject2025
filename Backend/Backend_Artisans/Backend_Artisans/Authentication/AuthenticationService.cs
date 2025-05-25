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
    

        IConfiguration _config;
        

        IService _service;

        public AuthenticationService(IConfiguration config,IService service)
        {
            _config = config;

            //migration test
            _service = service;

        }

        private string GenerateJSONWebToken(string username)
        {
            var secretKey = _config["Jwt:Key"];
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            //getUSers
            var user = _service.GetUsers().FirstOrDefault(x => x.Username == username);
            if (user == null)
            {
                throw new Exception("User not found");
            }

            //ajouter des claims
            var claims = new[] {
                new Claim(JwtRegisteredClaimNames.Sub, username),
                new Claim("custom_info", "info"),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim("UserId", user.Id.ToString()),
                
            };

            var jwtIssuer = _config["Jwt:Issuer"];
            var jwtAudience = _config["Jwt:Audience"];

            var token = new JwtSecurityToken(
                jwtIssuer,
                jwtAudience,
                claims,
                expires: DateTime.Now.AddMinutes(5),
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
            if (_service.GetUsers().Any(user => user.Username.ToLower() == username.ToLower()))
            {
                throw new Exception("User already exist");
            }

            var salt = Guid.NewGuid().ToString();
            var passwordHash = HashPassword(password, salt);

            var newUser = new User(GenerateNewId(), username, passwordHash, salt, role, false);
            //migration test
            _service.AddUser(newUser);
        }

        public string Login(string username, string password)
        {
            try
            {
                //migration test
                var user = _service.GetUsers().FirstOrDefault(user => user.Username.ToLower() == username.ToLower());

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

      

        private int GenerateNewId()
        {
            //migration test
            if (_service.GetUsers().Count() == 0)
            {
                return 1;
            }
            return _service.GetUsers().Max(u => u.Id) + 1;
        }
    }


}