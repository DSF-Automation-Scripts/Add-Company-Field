module.exports = {
    //Path to log and error log
    LOG_PATH: "./log.txt",
    ERROR_LOG_PATH: "./errorLog.txt",

    //Constants
    PRODUCTS_PER_PAGE: 25,
    IDENTIFIER: "DB POD",
    COMPANY_TO_SELECT_NAME: "DESERET BOOK STORE",

    //URL of the DSF home page
    URL: "u/",

    //Show advanced login options button on main login screen of DSF 
    DSF_SIGN_IN_SELECTION: "body > div.modal.ng-scope > div > div.modalcontent > form > div:nth-child(4) > button",

    //DSF login username text box
    DSF_USERNAME_TEXT_BOX: "body > div.modal.ng-scope > div > div.modalcontent > form > div:nth-child(5) > div.login-as-customer-container > div > input:nth-child(2)",

    //DSF login password text box
    DSF_PASSWORD_TEXT_BOX: "#loginPwd",

    //DSF login button
    DSF_LOGIN_BUTTON: "body > div.modal.ng-scope > div > div.modalcontent > form > div:nth-child(5) > div.login-as-customer-container > div > div.login-actions > button:nth-child(1)",

    //DSF login check element
    DSF_HEADER_ELEMENT: "#ctl00_lblProductName",

    //Admin elements
    DSF_ADMIN_BUTTON: "body > div.wrapper.ng-scope > div.header > div:nth-child(1) > div.top-bar.ng-scope > div > div:nth-child(2) > div > div",
    ADMIN_PRODUCT_BUTTON: "#ctl00_ctl00_C_M_LinkColumn3_RepeaterCategories_ctl00_RepeaterItems_ctl06_HyperLinkItem",
    
    //Element used to see if login was successful. Currently using header of DSF product view
    DSF_LOGIN_CHECK_ELEMENT: "#displayName_SmartSearchInput",

    //Loading animation that DSF plays while querying results
    HOME_SEARCH_SPINNER: "#loadingSpinner",
    DSF_SEARCH_SPINNER: "#aspnetForm > div.dot-rightpane > div.ctr-page > div > div:nth-child(2) > md-root:nth-child(1) > div > div.spinner.ng-star-inserted > p-progressspinner > div > svg",

    //Quantity per page dropdown and selection
    DSF_NUM_PER_PAGE_DROPDOWN: "#inventoryTbl > div > p-paginator > div > p-dropdown > div > div.ui-dropdown-trigger.ui-state-default.ui-corner-right > span",
    DSF_NUM_PER_PAGE_DROPDOWN_CHECK: "#inventoryTbl > div > p-paginator > div > p-dropdown > div > div.ng-trigger.ng-trigger-overlayAnimation.ng-tns-c7-6.ui-dropdown-panel.ui-widget.ui-widget-content.ui-corner-all.ui-shadow.ng-star-inserted > div > ul",
    DSF_NUM_PER_PAGE_DROPDOWN_TO_SELECT: "#inventoryTbl > div > p-paginator > div > p-dropdown > div > div.ng-trigger.ng-trigger-overlayAnimation.ng-tns-c7-6.ui-dropdown-panel.ui-widget.ui-widget-content.ui-corner-all.ui-shadow.ng-star-inserted > div > ul > p-dropdownitem:nth-child(3) > li",

    //"Name" text box
    DSF_NAME_TEXT_BOX: "#productName_SmartSearchInput",

    //After search, the results parts
    DSF_AFTER_SEARCH_RESULT_FIRST_HALF: "#inventoryTbl > div > div.ui-table-scrollable-wrapper.ng-star-inserted > div > div.ui-table-scrollable-body > table > tbody > tr:nth-child(",
    DSF_AFTER_SEARCH_RESULT_SECOND_HALF: ") > td:nth-child(5) > p-celleditor > div > md-grid-link-data",

    //Next page button on DSF
    DSF_NEXT_PAGE_BUTTON_DISABLED: "#inventoryTbl > div > p-paginator > div > a.ui-paginator-next.ui-paginator-element.ui-state-default.ui-corner-all.ui-state-disabled",

    //Product tabs product name text box
    PRODUCT_NAME_TEXT_BOX: "#ctl00_ctl00_C_M_ctl00_W_ctl01__Name",

    //Company "select" button
    PRODUCT_SELECT_COMPANY_BUTTON: "#ctl00_ctl00_C_M_ctl00_W_ctl01_lnkComp",

    //Radio button by "Covenant" company selection
    PRODUCT_COMPANY_POPUP_NEW_COMPANY: "#ctl00_ctl00_C_M_ctl00_W_ctl01_companyPopUpFrame_ctl00_GridCompanies_ctl10_radioSelectCompany",

    //Ok button at the bottom of the company popup
    PRODUCT_COMPANY_POPUP_OK_BUTTON: "#ctl00_ctl00_C_M_ctl00_W_ctl01_companyPopUpFrame_btnOK",

    //Product tab save and exit button
    PRODUCT_SAVE_AND_EXIT_BUTTON: "#ctl00_ctl00_C_M_ctl00_W_StartNavigationTemplateContainerID_ctl00_BtnSaveAndExit",
    
    //Selected company
    PRODUCT_SELECTED_COMPANY: "#ctl00_ctl00_C_M_ctl00_W_ctl01_lnkComp",

    //Return codes for eval results
    EVAL_RESULTS_SUCCESS_CODE: 1,
}