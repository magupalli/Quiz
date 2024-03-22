using System.Configuration;
using System.Web.Http;
using System.Web.Http.Cors;
namespace ENTHubQuiz.QuizAPI
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            string origin = ConfigurationManager.AppSettings["AllowedOrigins"].ToString();
            var cors = new EnableCorsAttribute(origin, "*", "GET");
            cors.SupportsCredentials = true;
            config.EnableCors(cors);

            config.MapHttpAttributeRoutes();

        }
    }
}