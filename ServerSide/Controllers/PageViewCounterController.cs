namespace PageViewCounter.WebAPI.Controllers{
    [RoutePrefix("api/PageViewCounter")]
    public class PageViewCounterController : ApiController{
        [Route("getAllModulesViewCount")]
        public IHttpActionResult GetAllModulesViewCount(){
            var currentLoginName = UserHelper.CurrentUserName;
            var lstModuleViewsCount = new List<ModuleViewsCount_Summary>();
            try{
                lstModuleViewsCount = PageViewCounterDBHelper.GetAllModulesViewCount();
                
            }catch(Exception ex){}
            return Ok(lstModuleViewsCount);
        }

        [Route("getAllModulesViewCount_Export")]

    }
}