import asyncio
from playwright.async_api import async_playwright
import os

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={'width': 400, 'height': 800})
        url = "http://localhost:19006"
        print(f"Acessando {url}...")
        try:
            await page.goto(url, wait_until="networkidle", timeout=60000)
        except Exception as e:
            print(f"Erro ao acessar {url}: {e}")
            await browser.close()
            return
        await asyncio.sleep(10)
        os.makedirs("verification", exist_ok=True)
        guest_btn = page.get_by_text("Play as Guest")
        if await guest_btn.count() > 0:
            await guest_btn.first.click()
            await asyncio.sleep(5)
        game_card = page.get_by_text("Care for your virtual pet daily!")
        if await game_card.count() > 0:
            await game_card.first.click()
            await asyncio.sleep(5)
        create_new_btn = page.get_by_text("Create New Pet ✨")
        if await create_new_btn.count() > 0:
            await create_new_btn.first.click()
            await asyncio.sleep(3)
            input_box = page.get_by_placeholder("Type the name...")
            if await input_box.count() > 0:
                await input_box.first.fill("Verificador")
            create_confirm = page.get_by_text("Create Pet! 🎉")
            await create_confirm.first.click()
            await asyncio.sleep(10)
        else:
            continue_btn = page.get_by_text("Continue with")
            if await continue_btn.count() > 0:
                await continue_btn.first.click()
                await asyncio.sleep(10)
        await page.screenshot(path="verification/home_classic.png")
        home_menu_btn = page.locator("div").get_by_text("Menu", exact=True)
        await home_menu_btn.last.click()
        await asyncio.sleep(2)
        confirm_btn = page.get_by_text("Confirm", exact=True)
        if await confirm_btn.count() > 0:
            await confirm_btn.first.click()
            await asyncio.sleep(5)
        await page.screenshot(path="verification/menu_classic.png")
        theme_toggle = page.get_by_text("Switch Theme")
        await theme_toggle.first.click()
        await asyncio.sleep(3)
        await page.screenshot(path="verification/menu_modern.png")
        continue_modern = page.get_by_text("Continue with")
        await continue_modern.first.click()
        await asyncio.sleep(10)
        await page.screenshot(path="verification/home_modern.png")
        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
