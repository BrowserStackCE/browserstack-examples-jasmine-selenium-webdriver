const selenium = require('selenium-webdriver');
jasmine.getEnv().defaultTimeoutInterval = 60000; // in microseconds.
jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
const REMOTE_HUB_URL = process.env.REMOTE_HUB_URL;

describe('SPEC3', function () {

  beforeEach(function() {
    const caps = JSON.parse(process.env.CAPABILITIES);
    console.log("Test spec1 initiated with URL :: " + REMOTE_HUB_URL + " CAPS :: " + JSON.stringify(caps));

    this.driver = new selenium.Builder()
      .usingServer(process.env.REMOTE_HUB_URL)
      .withCapabilities(caps)
      .build();
  });

  afterEach(function (done) {
    this.driver.quit().then(done);
  });


  it('SPEC3 - TC1', async function() {
    await this.driver.get("https://www.browserstack.com");
    let automateCard = await this.driver.wait(selenium.until.elementLocated(selenium.By.xpath("//div[@class='product-cards-wrapper--click']//a[@title='Automate']")));
    await this.driver.wait(selenium.until.elementLocated(selenium.By.id("accept-cookie-notification"))).click();
    automateCard.click();
    await this.driver.wait(selenium.until.elementLocated(selenium.By.xpath("//a[@title='Selenium Capabilities']")));
    let pageTitle = await this.driver.getTitle();
    expect(pageTitle).toContain("Automated Selenium Testing On A Grid of 2000+ Browsers & Mobile Devices");
  });

});
