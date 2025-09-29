@echo off
echo Fetching ChromeDriver URL...
set /p chromedriver_url=<chromedriver_url.txt

echo Downloading ChromeDriver...
curl -o chromedriver.zip %chromedriver_url%

echo Extracting ChromeDriver...
powershell -command "Expand-Archive -Path chromedriver.zip -DestinationPath . -Force"

echo Moving ChromeDriver to project root...
move /Y chromedriver-win64\chromedriver.exe ..

echo Cleanup...
rmdir /S /Q chromedriver-win64
del chromedriver.zip
del chromedriver_url.txt

echo ChromeDriver is ready!
pause
