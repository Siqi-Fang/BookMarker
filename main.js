//++++++++++++ Website Class +++++++++++++//
class Websites{
    constructor(name,url){
        this.name = name;
        this.url = url;
    }
}
//++++++++++++ Storage Class +++++++++++++//
// interface for local storage and website json objects
class Store{
    /**
     * Loads local storage, return JSON array of Websites
     * @returns JSON array of websites
     */
    static getWebs(){
        let webs;
        if(localStorage.getItem('webs') === null){
            webs = [];
        }else{
            webs = JSON.parse(localStorage.getItem('webs'));
        }
        return webs;
    }
    /**
     * add website to local storage
     * @param {Websites} web Webobject
     */
    static addWeb(web){
        let webs = this.getWebs();
        webs.push(web);
        localStorage.setItem('webs',JSON.stringify(webs));
    }
    /**
     * remove website from local storage
     * @param {string} url url
     */
    static removeWeb(url){
        let webs = this.getWebs();
        webs = webs.filter((web)=>{
            return web.url !== url;
        });
        localStorage.setItem('webs', JSON.stringify(webs));
    }
    /**
        * edit website information in local storage
        * @param {string} currUrl -Url of the bookmark editing
        * @param {string} newName  
        * @param {string} newUrl
        */
    static editWeb(currUrl, newName, newUrl){
        let webs = this.getWebs();
        webs.forEach((web)=>{
            if(web.url === currUrl){
                web.url = newUrl;
                web.name = newName;
            };
        localStorage.setItem('webs', JSON.stringify(webs));
        });
    }
}
//++++++++++++ UI Class +++++++++++++//
class UI{
    static displayWebs(){
        let webs = Store.getWebs();
        webs.forEach(web => {
            this.add_link(web);
        })
    }
    /**
     * Show an alert Message
     * @param {string} alert_msg 
     * @param {string} alert_type danger/success
     */
    static showAlert(alert_msg, alert_type){
        const alert = document.createElement('div');
        alert.className = `alert alert-${alert_type}`;
        alert.innerHTML = alert_msg;
        alert.style = "position:absolute;width:95%";

        document.querySelector('.form-control')
            .insertBefore(alert, document.querySelector("h2"));

        setTimeout(()=>{
            document.querySelector('.alert').remove()}
            ,2000);
        }
    /**
     * delete a website from UI
     * @param {e.target} element the del-btn
     */
    static delete_link(element){
        element.parentElement.parentElement.remove();
    }
    /**
     * delete a website from UI
     * @param {li} element 
     */
    static group_delete(element){
        element.remove();
    }

    /**
     * Add a website to UI
     * @param {object} web Website
     */
    static add_link(web){
        let list = document.querySelector('#web-list');
        let row = document.createElement('li');

        row.innerHTML = `
        <li class="list-group-item mt-1" style="text-align:left" id="web-list-item">
            <input type="checkbox" class="custom-control-input" id="web-list-checkbox" style="visibility:hidden">
            
            <span class="fs-3" id="curr-name">${web.name}</span>
            <span id="btns" style="float:right">
              <a id="${web.url}"
                 href="https://${web.url}" class="btn btn-success ">
                 Go to</a>
              <input id="del-btn" type="button" class="btn btn-danger" value="Delete">
              <input id="edit-btn" type="button" class="btn btn-link" 
              value="Edit">
              </span>
        </li>
        `
        list.appendChild(row);
    }
    /**
     * Edit a website on UI
     * @param {li} item -the li of the target of edit
     */
    static edit_link(item,newName){
        item.querySelector("#curr-name").innerHTML = newName;
    }


}

//++++++++++++ Events +++++++++++++//
document.addEventListener('DOMContentLoaded', UI.displayWebs()) ;

//BookMark Operations
document.querySelector('ul').addEventListener('click',
  (e) => {
    // e.preventDefault(); 
    //Delete event
    if(e.target.getAttribute('id')==='del-btn'){
      // remove from page 
      UI.delete_link(e.target);
      // remove from storage
      Store.removeWeb(e.target.parentElement.firstChild.nextSibling.getAttribute('id'));
    }
    //GoTo Event (Opens in NewTab)
    if (e.target.tagName.toLowerCase() === 'a') {
        window.open(e.target.getAttribute('href'), '_blank');
    }
    //Edit Event
    if (e.target.getAttribute("id") === 'edit-btn') {
        editBookmark(e);
    }
});

//Add Bookmark
document.querySelector("#form-submit").addEventListener('click',
  (e) => {
    e.preventDefault();

    const siteName = document.querySelector('#site-name').value;
    const siteUrl = document.querySelector('#site-url').value;

    // check for completion 
    if(siteName == ''||siteUrl == ''){
        UI.showAlert("Please fill in all fields!",'danger');
    }else if(!checkUrl(siteUrl)){
        UI.showAlert("Please enter a valid url!",'danger')
    }
    else{
    // Put in Storage
    const newWeb = new Websites(siteName,siteUrl);
    UI.add_link(newWeb);
    Store.addWeb(newWeb);
    UI.showAlert("Add complete!",'success');
    }
  }
);

// Group Events 
// Enbale&Disable Group Edit
document.querySelector("#edit-all-btn").addEventListener('click',
  (e) => {
    var visibility = document.querySelector("#web-list-checkbox")
    .getAttribute("style").substring(11);
    // makes all checkboxes visible
    if (visibility == "hidden") {
        document.querySelectorAll("#web-list-checkbox").forEach(checkbox =>{
          checkbox.checked = false;
          checkbox.setAttribute("style", "visibility:visible")});
        
        document.querySelector("#del-all-btn").disabled = false;
        document.querySelector("#open-all-btn").disabled = false;
    }
    else{//hides checkboxes
        document.querySelectorAll("#web-list-checkbox").forEach(checkbox =>
        checkbox.setAttribute("style", "visibility:hidden"))
        //disable group action buttons
        document.querySelector("#del-all-btn").disabled = true;
        document.querySelector("#open-all-btn").disabled = true;
        };    
});

//DeletAll 
document.querySelector("#del-all-btn").addEventListener('click',
  (e) => {
    var websites = document.querySelectorAll("#web-list-item");

    websites.forEach(website=>{
        if(website.querySelector("#web-list-checkbox").checked==true){
          UI.group_delete(website);
          Store.removeWeb(website.querySelector('a').getAttribute('id'));
        };
    })
});

//Open All
document.querySelector("#open-all-btn").addEventListener('click',
    (e) => {
        var websites = document.querySelectorAll("#web-list-item");

        websites.forEach(website => {
            if (website.querySelector("#web-list-checkbox").checked == true) {
                window.open('https://'+website.querySelector('a').getAttribute('id'), '_blank')
            };
        })
    });

//Edit Function
const editBookmark = (e) => {
    const web = e.target.parentElement.parentElement; 
    var site_name = document.querySelector("#site-name-new");
    var url = document.querySelector("#site-url-new");
    //default configurations
    document.querySelector("#edit-popup").setAttribute("style", "visibility:visible");
    site_name.setAttribute("value", web.querySelector("#curr-name").innerHTML);
    url.setAttribute("value", web.querySelector("a").getAttribute("id"));
    //cancel 
    document.querySelector("#edit-cancel").addEventListener("click", () => {
        document.querySelector("#edit-popup").setAttribute("style", "visibility:hidden");
    })
    //Submit
    document.querySelector("#edit-submit").addEventListener("click", () => {
        updateBookmark(web,document.querySelector("#site-name-new").value,
                       document.querySelector("#site-url-new").value);
        document.querySelector("#edit-popup").setAttribute("style", "visibility:hidden");
    })
}
    
const updateBookmark = (curr_web, siteName, siteUrl) =>{
    if (siteName == '' || siteUrl == '') {
        UI.showAlert("Please fill in all fields!", 'danger');} 
    else if (!checkUrl(siteUrl)) {
        UI.showAlert("Please enter a valid url!", 'danger')
    }
    else {
       // Edit
        const curr_url = curr_web.querySelector("a").getAttribute('id');
        UI.edit_link(curr_web, siteName);
        Store.editWeb(curr_url,siteName,siteUrl);
        UI.showAlert("Change completed!", 'success');
    }
}
/**
 * Check for valid url form
 * @param {string} url 
 */
const checkUrl = (url) => {
    // from Devshed 
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(url);//return false is url is NOT valid
}