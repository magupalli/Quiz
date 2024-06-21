using System.Security.Cryptography;

namespace EncryptuonLibrary{
    public class StringCipher {
        const int DerivationIterations = 100;
        const int KeySize = 256;

        public static string Encrypt(string plainText){
            string passPhrase = ConfigurationManager.AppSettings["PassPhrase"].ToString();
            var saltStringBytes = Generate256BitsOfRandomEntropy();
            var ivStringBytes = Generate256BitsOfRandomEntropy();
            var plainTextBytes = Encoding.UTF8.GetBytes(plainText);
            using(var password= new Rfc2898DeriveBytes(passPhrase,saltStringBytes,DerivationIterations)){
                var keyBytes = password.GetBytes(KeySize / 8);
                using(var symmetricKey = new RijndaelManaged()){
                    symmetricKey.BlockSize = 256;
                    symmetricKey.Mode = CipherMode.CBC;
                    symmetricKey.Padding = PaddingMode.PKCS7;
                    using(var encryptor = symmetricKey.CreateEncryptor(keyBytes,ivStringBytes)){
                        using(var memoryStream = new MemoryStream()){
                            using(var cryptoStream = new CryptoStream(memoryStream,encryptor,CryptoStream.Write)){
                                cryptoStream.Write(plainTextBytes,0,plainTextBytes.Length);
                                cryptoStream.FlushFinalBlock();
                                var cipherTextBytes = saltStringBytes;
                                cipherTextBytes = cipherTextBytes.Concat(ivStringBytes).ToArray();
                                cipherTextBytes = cipherTextBytes.Concat(memoryStream.ToArray()).ToArray();
                                memoryStream.Close();
                                cryptoStream.Close();
                                return Convert.ToBase64String(cipherTextBytes);
                            }
                        }
                    }
                }
            }
        }


        public static string Decrypt(string cipherText){
            string passPhrase = ConfigurationManager.AppSettings["PassPhrase"].ToString();
            var cipherTextBytesWithSaltAndIv =Convert.FromBase64String(cipherText);

            
            var saltStringBytes = cipherTextBytesWithSaltAndIv.Take(KeySize / 8 ).ToArray();
            var ivStringBytes = cipherTextBytesWithSaltAndIv.Skip(KeySize / 8 ).Take(KeySize / 8 ).ToArray();
            var cipherTextBytes = cipherTextBytesWithSaltAndIv.Skip((KeySize / 8) * 2 ).Take(cipherTextBytesWithSaltAndIv.Length -((KeySize / 8) *2) ).ToArray();
            using(var password= new Rfc2898DeriveBytes(passPhrase,saltStringBytes,DerivationIterations)){
                var keyBytes = password.GetBytes(KeySize / 8);
                using(var symmetricKey = new RijndaelManaged()){
                    symmetricKey.BlockSize = 256;
                    symmetricKey.Mode = CipherMode.CBC;
                    symmetricKey.Padding = PaddingMode.PKCS7;
                    using(var decryptor = symmetricKey.CreateDecryptor(keyBytes,ivStringBytes)){
                        using(var memoryStream = new MemoryStream()){
                            using(var cryptoStream = new CryptoStream(memoryStream,decryptor,CryptoStream.Read)){
                                
                                var plainTextBytes = new byte[cipherTextBytes.Length];
                                var decryptedByteCount = cryptoStream.Read(plainTextBytes,0,plainTextBytes.Length);
                                memoryStream.Close();
                                cryptoStream.Close();
                                return Encoding.UTF8.GetString(plainTextBytes,0,decryptedByteCount);
                            }
                        }
                    }
                }
            }
        }

        private static byte[] Generate256BitsOfRandomEntropy(){
            var randomBytes = new byte[32];
            using(var rngCsp = new RNGCryptoServiceProvider()){
                rngCsp.GetBytes(randomBytes);
            }
            return randomBytes;
        }
    }
}