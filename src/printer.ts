import puppeteer, { Browser } from 'puppeteer';

class Printer {
    private browser!: Browser;

    async init () {
        this.browser = await puppeteer.launch({args: ['--no-sandbox']});
    }

    async print (html: string) : Promise<Buffer> {
        const page = await this.browser.newPage();
        await page.setJavaScriptEnabled(false);
        await page.setContent(html, {waitUntil: 'networkidle0'});

        const pdf = await page.pdf({format: 'A4'});
        page.close();

        return pdf;
    }
}

export default new Printer();