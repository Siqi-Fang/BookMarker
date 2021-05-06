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
     */
    static getWebs(){
        let webs;
        if(localStorage.getItem('webs')===null){
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
     * @param {e.target} element e.target==<li>
     */
    static delete_link(element){
        element.parentElement.parentElement.remove();
    }
    /**
     * Add a website to UI
     * @param {object} web Website
     */
    static add_link(web){
        let list = document.querySelector('#web-list');
        let row = document.createElement('li');

        row.innerHTML = `
        <li class="list-group-item mt-1" style="text-align:left">
            <span class="fs-3">
            ${web.name}</span>
            <span style="float:right">
              <a id="${web.url}"
                 href="https://${web.url}" class="btn btn-success ">
                 Go to</a>
              <input id="del-btn" type="button" class="btn btn-danger" value="Delete">
            </span>
        </li>
        `
        list.appendChild(row);
    }

}

//++++++++++++ Events +++++++++++++//
document.addEventListener('DOMContentLoaded', UI.displayWebs()) ;
/* TODO:
  ????I would mess up the storage if I add event on the del button */
document.querySelector('ul').addEventListener('click',
  (e) => {
    e.preventDefault();
    //delete event
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
});

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