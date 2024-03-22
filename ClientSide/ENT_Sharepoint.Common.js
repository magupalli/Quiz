var ENT_Sharepoint = ENT_Sharepoint || {};
(function(){
    'use strict';
    ENT_Sharepoint.Common = {
        getGroupMembers : function(groupName,getGroupMembers_Success){
            $.ajax({
                url: _spPageContextINfo.webAbsoluteUrl + "/_api/Web/SiteGroups/GetByName('"+groupName+"')/users?4select=Id,LoginName,Email,Title",
                headers: {
                    Accept: "application/json;odata=verbose"
                },
                async: true,
                xhrFields: {
                    withCredentials: true
                },
                success: function (data_items) {
                    getGroupMembers_Success(data_items);
                },
                error: function (errordata) {
                    console.log(errordata);
                    
                }
            });
        },
        isMemberOfGroup : function(groupName,isMemberOfGroup_Success){
            $.ajax({
                url: _spPageContextINfo.webAbsoluteUrl + "/_api/Web/currentuser/?$select=Groups/Title&$expand=groups",
                headers: {
                    Accept: "application/json;odata=verbose"
                },
                async: true,
                xhrFields: {
                    withCredentials: true
                },
                success: function (data_items) {
                    let userGroups = data_item.d.Groups.results;
                    let isGroupMember = false;
                    $(userGroups).each(function(idx,item){
                        if(groupName.toUpperCase() == item.Title.toUpperCase()){
                            isGroupMember = true;
                        }
                    });
                    isMemberOfGroup_Success(isGroupMember);
                },
                error: function (errordata) {
                    console.log(errordata);
                    
                }
            });
        },
    };
})();