const puppeteer = require("puppeteer");
const fs = require("fs");
const constants = require("./constants");
const credentials = require("./credentials");

/*
 * A function that takes a string message and returns the same message wit hthe date and time prepended to it.
 *
 * @param {type} var The message to have the date and time prepended and returned.
 *
 * @return {type} var The message given with the current date and time prepended.
 */
function getMessageWithTime(message) {
  //Generate a new date
  let today = new Date();

  //Format date to desired look
  let date =
    today.getDay() + "/" + today.getMonth() + "/" + today.getFullYear() + " ";
  let hours = today.getHours();
  let minutes = today.getMinutes();
  let seconds = today.getSeconds();

  //Append zero to hour, minute, or second if only one digit
  if (String(hours).length === 1) {
    date += "0" + String(hours) + ":";
  } else {
    date += hours + ":";
  }
  if (String(minutes).length === 1) {
    date += "0" + String(minutes) + ":";
  } else {
    date += minutes + ":";
  }
  if (String(seconds).length === 1) {
    date += "0" + String(seconds) + ": ";
  } else {
    date += seconds + ": ";
  }

  //Return
  return date + message;
}

/*
 * A function that takes a message and logs it to both a local console and a more permanent text log.
 *
 * @param {type} var The message to log to both the console and the log.
 *
 * @return {type} none No return value.
 */
function logToConsoleAndLog(message) {
  //Log message
  console.log(message);

  //Write message to log
  fs.appendFile(constants.LOG_PATH, message + "\n", function (err) {
    if (err) throw err;
  });
}

/*
 * A function that ensures DSF isn't currently loading.
 *
 * @param {Object} page The currently created page object from puppeteer.
 *
 * @return {type} none No return value.
 */
async function waitForLoad(page) {
  //If load element is present, wait 100 ms and check again
  while ((await page.$(constants.DSF_SEARCH_SPINNER)) !== null) {
    await page.waitForTimeout(100);
  }
}

/*
 * A function that logs in to DSF.
 *
 * @param {Object} page The currently created page object from puppeteer.
 *
 * @return {type} none No return value.
 */
async function login(page) {
  //Ensure the login button exists and click it
  await page.waitForSelector(constants.DSF_SIGN_IN_SELECTION);
  await page.waitForTimeout(500);
  await page.click(constants.DSF_SIGN_IN_SELECTION);

  //Wait until login dialog pops up
  await page.waitForSelector(constants.DSF_USERNAME_TEXT_BOX);

  //Enter username and password
  await page.type(constants.DSF_USERNAME_TEXT_BOX, credentials.USERNAME);
  await page.type(constants.DSF_PASSWORD_TEXT_BOX, credentials.PASSWORD);

  //Click login
  await page.click(constants.DSF_LOGIN_BUTTON);

  //Check if login was successful using admin button, throw error if not
  try {
    await page.waitForSelector(constants.DSF_ADMIN_BUTTON, {
      visible: true,
      setTimeout: 5000,
    });
  } catch (error) {
    throw "loginError";
  }

  //Wait for DSF home page to load
  await page.waitForSelector(constants.HOME_SEARCH_SPINNER, {
    hidden: true,
  });
}

/*
 * A function that iterates through a page of results on DSF and performs an action on each product
 *
 * @param {Object} page    The currently created page object from puppeteer.
 * @param {Object} browser The currently created browser object from puppeteer.
 *
 * @return {type} none No return value.
 */
async function evalResults(page, browser) {
  //Run through each product currently on the page
  for (let i = 1; i <= constants.PRODUCTS_PER_PAGE; i++) {

    //Ensure DSF isn't loading
    await page.waitForSelector(constants.DSF_SEARCH_SPINNER);
    await waitForLoad(page);

    //Check if results were found and an element exists
    let elementPath =
      constants.DSF_AFTER_SEARCH_RESULT_FIRST_HALF +
      String(i) +
      constants.DSF_AFTER_SEARCH_RESULT_SECOND_HALF;

    //If no results there, all results have been iterated
    if ((await page.$(elementPath)) === null) {
      logToConsoleAndLog(getMessageWithTime("All results evaluated"));
      return constants.EVAL_RESULTS_SUCCESS_CODE;
    }

    //Grab elements current name
    let currResultName = await page.$eval(elementPath, (el) => el.innerText);

    //If name has identifier at the start, enter product to edit
    if (currResultName.substring(0, constants.IDENTIFIER.length) === constants.IDENTIFIER) {

      //Decrement i, since it will no longer show up in results
      i--;
      logToConsoleAndLog(
        getMessageWithTime("Changing product: " + String(currResultName))
      );

      //This will become the new tab opened by DSF
      const newPagePromise = new Promise((x) =>
        browser.once("targetcreated", (target) => x(target.page()))
      );

      //Enter the element
      await page.click(elementPath);
      const productTab = await newPagePromise;
      await productTab.waitForSelector(constants.PRODUCT_NAME_TEXT_BOX);

      //Update name by removing identifier
      let newProductName = currResultName.substring(constants.IDENTIFIER.length + 1, currResultName.length);
      while (newProductName[0] === " ") {
        newProductName = newProductName.slice(0, 1);
      }

      //Input new name
      await productTab.click(constants.PRODUCT_NAME_TEXT_BOX, {
        clickCount: 3,
      });
      await productTab.keyboard.press("Backspace");
      await productTab.type(constants.PRODUCT_NAME_TEXT_BOX, newProductName);

      //Choose company
      await chooseCompany(productTab);

      //Ensure company was selected
      let companySelected = await productTab.$eval(
        constants.PRODUCT_SELECTED_COMPANY,
        (el) => el.innerText
      );

      //If company did not select properly, try again
      while (companySelected !== "DESERET BOOK STORE") {
        chooseCompany(productTab);
        companySelected = await productTab.$eval(
          constants.PRODUCT_SELECTED_COMPANY,
          (el) => el.innerText
        );
      }

      //Save and exit
      await productTab.click(constants.PRODUCT_SAVE_AND_EXIT_BUTTON);
    } else {

      //Skip product if identifier doesn't exist in product name
      logToConsoleAndLog(
        getMessageWithTime("Skipping product: ") + String(currResultName)
      );
      continue;
    }
  }

  //Check if next arrow is available. Press if it is, return finish code if not
  if ((await page.$(constants.DSF_NEXT_PAGE_BUTTON_DISABLED)) === null) {
    await page.click(constants.DSF_NEXT_PAGE_BUTTON);
    await waitForLoad(page);
    return await evalResults(page, browser);
  } else {
    logToConsoleAndLog(getMessageWithTime("All results evaluated"));
    return constants.EVAL_RESULTS_SUCCESS_CODE;
  }
}

/*
 * A function that chooses the company desired
 *
 * @param {Object} productTab The currently created product page object from puppeteer.
 *
 * @return {type} none No return value.
 */
async function chooseCompany(productTab) {
  //Keep track of the company popup being shown or not
  let companyPopupShown = false;

  //If the popup doesn't exist
  while (!companyPopupShown) {

    //Attempt to open the company popup until it succeeds
    try {
      await productTab.click(constants.PRODUCT_SELECT_COMPANY_BUTTON);
      await productTab.waitForSelector(
        constants.PRODUCT_COMPANY_POPUP_NEW_COMPANY,
        {
          timeout: 5000,
        }
      );
      companyPopupShown = true;
    } catch (error) {
      continue;
    }
  }

  //Select new company in the popup
  await productTab.click(constants.PRODUCT_COMPANY_POPUP_NEW_COMPANY);
  await productTab.click(constants.PRODUCT_COMPANY_POPUP_OK_BUTTON);

  //Make sure everything has cleared and loaded properly
  await productTab.waitForNavigation();
  await productTab.waitForTimeout(2500);

  //Double check correct company has been selected
  let companySelected = await productTab.$eval(
    constants.PRODUCT_SELECTED_COMPANY,
    (el) => el.innerText
  );

  //If the correct company isn't selected, attempt to select it again
  while (companySelected !== constants.COMPANY_TO_SELECT_NAME) {
    await productTab.waitForTimeout(100);
    companySelected = await productTab.$eval(
      constants.PRODUCT_SELECTED_COMPANY,
      (el) => el.innerText
    );
  }
}

/*
 * Main run function
 *
 * @param {type} none No parameters
 *
 * @return {type} none No return value.
 */
async function run() {
  try {

    //Erase log file
    fs.writeFile(constants.LOG_PATH, "", (err) => {
      if (err) throw err;
    });

    //Launch Chrome and open a new page
    console.clear();
    logToConsoleAndLog("*** START LOG ***");
    logToConsoleAndLog(getMessageWithTime("Launching Chrome"));
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
    });
    const [page] = await browser.pages();

    //Go to site
    logToConsoleAndLog(getMessageWithTime("Navigating to " + constants.URL));
    await page.goto(constants.URL);

    //Login
    logToConsoleAndLog(getMessageWithTime("Logging in"));
    await login(page);
    logToConsoleAndLog(getMessageWithTime("Successfully logged in"));

    //Go to products page
    await page.waitForTimeout(500);
    await page.click(constants.DSF_ADMIN_BUTTON);
    await page.waitForSelector(constants.ADMIN_PRODUCT_BUTTON);
    await page.click(constants.ADMIN_PRODUCT_BUTTON);
    await page.waitForSelector(constants.DSF_SEARCH_SPINNER);
    await waitForLoad(page);

    //Query identifier in name text box
    logToConsoleAndLog(getMessageWithTime("Querying DB POD products"));
    await page.type(constants.DSF_NAME_TEXT_BOX, constants.IDENTIFIER);
    await page.keyboard.press("Enter");

    //Evaluate results
    let executeCode = await evalResults(page, browser);
    if (executeCode === constants.EVAL_RESULTS_SUCCESS_CODE) {

      //Finish up
      logToConsoleAndLog(
        getMessageWithTime(
          "Script successfully executed. See directory for log information"
        )
      );
      await page.waitForTimeout(2500);
      process.exit(0);
    }
  } catch (err) {
    
    //Handle errors
    logToConsoleAndLog("*** ERROR ***");
    if(err === "loginError") {
      logToConsoleAndLog(getMessageWithTime("Failed to log in. Please check credentials and try again"));
    }
    else {
      logToConsoleAndLog(getMessageWithTime(err));
    }
  }
}

run();
