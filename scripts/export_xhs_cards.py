#!/usr/bin/env python3
"""
将指定 HTML 页面中的 .card 批量导出为小红书标准 1080x1440 PNG 图片
"""
import sys
import os
import argparse
from playwright.sync_api import sync_playwright

def export_cards(html_path, output_dir, scale=1):
    html_abs = os.path.abspath(html_path)
    if not os.path.exists(html_abs):
        print(f"Error: HTML file not found: {html_abs}")
        sys.exit(1)
        
    os.makedirs(output_dir, exist_ok=True)
    
    chrome_path = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    if not os.path.exists(chrome_path):
        print(f"Warning: Chrome not found at {chrome_path}, falling back to default chromium")
        executable = None
    else:
        executable = chrome_path

    with sync_playwright() as p:
        launch_args = {"headless": True}
        if executable:
            launch_args["executable_path"] = executable
            
        browser = p.chromium.launch(**launch_args)
        # 视口设为 1200x1600 容纳 1080x1440 卡片
        page = browser.new_page(viewport={"width": 1200, "height": 1600}, device_scale_factor=scale)
        
        file_url = f"file://{html_abs}"
        print(f"Loading {file_url} ...")
        page.goto(file_url, wait_until="networkidle")
        page.wait_for_timeout(1000)
        
        cards = page.locator(".card")
        total = cards.count()
        print(f"Found {total} cards in {html_path}")
        
        for i in range(total):
            card_num = f"{i+1:02d}"
            out_file = os.path.join(output_dir, f"card-{card_num}.png")
            card = cards.nth(i)
            card.scroll_into_view_if_needed()
            page.wait_for_timeout(200)
            card.screenshot(path=out_file)
            print(f"  -> [{card_num}/{total:02d}] Exported: {out_file}")
            
        browser.close()
    print(f"\nAll {total} cards successfully exported to {output_dir}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Export .card elements to XHS images")
    parser.add_argument("html", help="Path to input HTML file")
    parser.add_argument("output", help="Output directory")
    parser.add_argument("--scale", type=int, default=1, help="Device scale factor (default 1 for 1080x1440)")
    
    args = parser.parse_args()
    export_cards(args.html, args.output, args.scale)
