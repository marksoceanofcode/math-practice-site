/*
  Description: Handle setting and displaying some site information
  File Name: site.js
  File Path: /js/site.js
*/

const siteInformation = () => {
    const siteObj = {
        version: "1.0.0"
    }
    
    return siteObj;
}

const displayVersion = () => {
    const displaySiteVersionId = "#displaySiteVersion"
    const version = "v" + siteInformation().version;

    $(displaySiteVersionId).empty().append(version);
}