import requests
import json

# Fetch the latest ChromeDriver version
url = "https://googlechromelabs.github.io/chrome-for-testing/last-known-good-versions-with-downloads.json"
response = requests.get(url)
data = response.json()

# Extract the Windows ChromeDriver URL
chrome_driver_url = data["channels"]["Stable"]["downloads"]["chromedriver"][0]["url"]

# Save the download link
with open("chromedriver_url.txt", "w") as file:
    file.write(chrome_driver_url)

print("ChromeDriver URL saved. Run setup_selenium.bat to download it.")
