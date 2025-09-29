from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
import time
import os

driver = webdriver.Chrome()
driver.maximize_window() 
prefs = {"Downloads.default_directory": os.getcwd()}
download_dir = os.path.join(os.path.expanduser("~"), "Downloads")


def test_admin_login():
    driver.get("http://localhost:5174")  # React dev server

    try:
        wait = WebDriverWait(driver, 20)
        
        time.sleep(4)  # Small delay to mimic user behavior
        # Wait for email and password inputs
        email_input = wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, "input[type='email']")))
        password_input = wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, "input[type='password']")))
 
        time.sleep(3)  # Small delay to mimic user behavior
        # Fill credentials
        email_input.send_keys("admin@gmail.com")
        time.sleep(2)  # Small delay to mimic user behavior
        password_input.send_keys("admin123")

        time.sleep(2)  # Small delay to mimic user behavior

        # Wait for submit button and click
        submit_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[@type='submit']")))
        submit_button.click()

        # Wait for redirect to dashboard
        wait.until(EC.url_contains("/dashboard"))
        time.sleep(3)  # Small delay to mimic user behavior
        print("Login successful!")

    except Exception as e:
        print(f"Login test failed: {e}")

def test_bike_inventory():
    try:
        wait = WebDriverWait(driver, 2)

        # Navigate to bike inventory
        bike_inventory_link = wait.until(EC.element_to_be_clickable((By.LINK_TEXT, "Bikes")))
        bike_inventory_link.click()

        # Wait for bike inventory page to load
        wait.until(EC.url_contains("/bikes"))
        time.sleep(3)  # Small delay to mimic user behavior

        # Verify presence of bike list
        print("Bike inventory loaded successfully!")
        bike_grid = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "div.grid > div.motion-div, div.grid > div")))
        if not bike_grid:
            raise Exception("Bike list not found!")
        else:
            print("Bike list has loaded!")

    except Exception as e:
        print(f"Bike inventory test failed: {e}")


def test_bike_view_details():
    try:
        wait = WebDriverWait(driver, 10)

        # Click the first "View" button
        view_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'View')]")))
        view_button.click()
        print("View button clicked!")

        time.sleep(1)

        # Wait for modal (fixed valid selector)
        modal = wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, "div.fixed.inset-0")))
        print("View Bike modal opened!")

        tabs = ["Info", "Documents", "Images"]

        for tab in tabs:
            tab_button = wait.until(
                EC.element_to_be_clickable((By.XPATH, f"//button[contains(text(), '{tab}')]"))
            )
            tab_button.click()
            print(f"Switched to {tab} tab")
            time.sleep(3)

            # Print content for check
            if tab.lower() == "info":
                print("Click on Info tab")
                info_items = driver.find_elements(By.CSS_SELECTOR, "div.grid div")
                # for item in info_items:
                #     print(item.text)
            elif tab.lower() == "documents":
                print("Click on Documents tab")
                docs = driver.find_elements(By.CSS_SELECTOR, "div.flex.flex-wrap > div")
                # for doc in docs:
                #     print(doc.text)
            elif tab.lower() == "images":
                print("Click on Images tab")
                imgs = driver.find_elements(By.CSS_SELECTOR, "div.flex.flex-wrap img")
                # for img in imgs:
                #     print(img.get_attribute("src"))

        # Close modal
        close_button = driver.find_element(By.XPATH, "//button[text()='Close']")
        close_button.click()
        print("Bike Inventory View Modal Completed and closed")

    except Exception as e:
        print(f"Bike view test failed: {e}")

def test_bike_add():
    try:
        wait = WebDriverWait(driver, 10)

        # Click "Add Bike" button
        add_bike_button = wait.until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Add Bike')]"))
        )
        add_bike_button.click()
        print("Add Bike button clicked!")

        # Wait for Add Bike modal
        modal = wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, "div.fixed.inset-0")))
        print("Add Bike modal opened!")

        # === INFO TAB ===
        wait.until(EC.visibility_of_element_located((By.NAME, "model"))).send_keys("Yamaha FZ")
        driver.find_element(By.NAME, "year").send_keys(2023)
        driver.find_element(By.NAME, "price").send_keys(4500)
        driver.find_element(By.NAME, "stock").send_keys(1)
        driver.find_element(By.NAME, "mileage").send_keys(40)
        driver.find_element(By.NAME, "engineCapacity").send_keys(150)
        driver.find_element(By.NAME, "brand").send_keys("Yamaha")
        driver.find_element(By.NAME, "condition").send_keys("Used")
        driver.find_element(By.NAME, "ownerName").send_keys("John Doe")
        driver.find_element(By.NAME, "ownerContact").send_keys(1234567890)
        driver.find_element(By.NAME, "description").send_keys("Powerful commuter bike")
        print("✅ Info tab filled")

        # === DOCUMENTS TAB ===
        driver.find_element(By.XPATH, "//button[contains(text(), 'Documents')]").click()
        time.sleep(1)

        sample_pdf = os.path.abspath("sample.pdf")
        doc_inputs = driver.find_elements(By.CSS_SELECTOR, "input[type='file']")
        for inp in doc_inputs:
            inp.send_keys(sample_pdf)
        print("✅ Documents uploaded")

        # === IMAGES TAB ===
        driver.find_element(By.XPATH, "//button[contains(text(), 'Images')]").click()
        time.sleep(2)

        sample_img = os.path.abspath("bike.jpg")
        img_input = wait.until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "input[type='file'][multiple]"))
        )
        img_input.send_keys(sample_img)
        print("✅ Bike image uploaded")
        time.sleep(2)

        # === SUBMIT FORM ===
        add_btn = wait.until(
            EC.element_to_be_clickable((By.XPATH, "//button[text()='Add Bike']"))
        )

        # Scroll into view and JS click to avoid overlay issue
        driver.execute_script("arguments[0].scrollIntoView(true);", add_btn)
        driver.execute_script("arguments[0].click();", add_btn)
        print("✅ Add Bike button clicked")

        # === HANDLE ALERT ===
        alert = wait.until(EC.alert_is_present())
        alert_text = alert.text
        if not alert:
            print("No alert appeared!")
        else:
            print(f"Alert appeared: {alert_text}")
        alert.accept()
        print("✅ Alert accepted")

    except Exception as e:
        print(f"Bike add test failed: {e}")


def test_bike_edit():
    try:
        wait = WebDriverWait(driver, 10)

        # === STEP 1: Open Edit Modal ===
        edit_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Edit')]")))
        edit_button.click()
        print("Edit Bike button clicked!")

        modal = wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, "div.fixed.inset-0")))
        print("Edit Bike modal opened!")

        # === STEP 2: Verify Pre-Filled Info ===
        model_input = wait.until(EC.presence_of_element_located((By.NAME, "model")))
        print(f"Pre-filled model: {model_input.get_attribute('value')}")
        
        # Update fields
        model_input.clear()
        model_input.send_keys("Updated Yamaha FZ")

        price_input = driver.find_element(By.NAME, "price")
        price_input.clear()
        price_input.send_keys("5000")
        print("✅ Info tab updated")

        # === STEP 3: Documents Tab ===
        driver.find_element(By.XPATH, "//button[contains(text(), 'Documents')]").click()
        time.sleep(1)

        sample_pdf = os.path.abspath("sample.pdf")
        doc_inputs = driver.find_elements(By.CSS_SELECTOR, "input[type='file']")
        if doc_inputs:
            doc_inputs[0].send_keys(sample_pdf)
            print("✅ New document uploaded")

        # === STEP 4: Images Tab ===
        driver.find_element(By.XPATH, "//button[contains(text(), 'Images')]").click()
        time.sleep(1)

        # Upload new image
        sample_img = os.path.abspath("bike.jpg")
        img_input = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[type='file'][multiple]")))
        img_input.send_keys(sample_img)
        print("✅ New image uploaded")

        # Remove first retained image (if exists)
        remove_buttons = driver.find_elements(By.CSS_SELECTOR, "button.absolute.bg-red-500")
        if remove_buttons:
            remove_buttons[0].click()
            print("✅ Removed one retained image")

        # === STEP 5: Save Changes ===
        save_btn = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Save')]")))
        save_btn.click()
        print("✅ Save button clicked")

        # === STEP 6: Wait for modal to close ===
        wait.until(EC.invisibility_of_element_located((By.CSS_SELECTOR, "div.fixed.inset-0")))
        print("✅ Bike edit saved successfully!")

    except Exception as e:
        print(f"Bike edit test failed: {e}")


def test_bike_delete():
    try:
        wait = WebDriverWait(driver, 10)

        # Click the first "Delete" button
        delete_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Delete')]")))
        delete_button.click()
        print("Delete button clicked!")
        time.sleep(1)

        # Wait for confirmation dialog
        alert = driver.switch_to.alert
        print("Alert text:", alert.text)  # just to verify
        alert.accept()
        time.sleep(2)  # Wait for deletion to process
        print("Confirmed deletion")

    except Exception as e:
        print(f"Bike delete test failed: {e}")


def test_bike_report(): 
    try:
        wait = WebDriverWait(driver, 10)

        # Locate and click the Generate Report button
        generate_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Generate Report')]")
        generate_button.click()
        print("Generate Report button clicked!")

        time.sleep(3)

        # # Case: If report downloads (check file exists in download dir)
        # files = os.listdir(download_dir)
        # print("Files in download directory:", files)
        # pdf_files = [f for f in files if f.endswith(".pdf")]
        # if pdf_files:
        #     latest_file = max(pdf_files, key=os.path.getmtime)  # get the most recently modified file
        #     print("Latest downloaded report:", os.path.basename(latest_file))
        # else:
        #     print("No PDF report found in the download directory.")

    except Exception as e:
        print(f"Bike report test failed: {e}")

def test_bike_sell():
    try:
        wait = WebDriverWait(driver, 10)

        # Click the first "Sell" button
        sell_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Sell')]")))
        sell_button.click()
        print("Sell button clicked!")

        time.sleep(1)

        wait.until(EC.visibility_of_element_located((By.NAME, "newOwnerName"))).send_keys("Alice Smith")
        driver.find_element(By.NAME, "newOwnerContact").send_keys(9876543210)
        driver.find_element(By.NAME, "soldFor").send_keys(4800)

        # Fill out the sell form
        # buyer_name_input = wait.until(EC.presence_of_element_located((By.NAME, "New Owner Name")))
        # buyer_name_input.send_keys("Alice Smith")

        # buyer_contact_input = driver.find_element(By.NAME, "New Owner Contact")
        # buyer_contact_input.send_keys("9876543210")

        # sale_price_input = driver.find_element(By.NAME, "Selling Price")
        # sale_price_input.send_keys("4800")

        print("✅ Sell form filled")

        # Submit the sell form
        sell_btn = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[text()='Sell Bike']")))
        driver.execute_script("arguments[0].scrollIntoView(true);", sell_btn)
        driver.execute_script("arguments[0].click();", sell_btn)
        print("✅ Sell Bike button clicked")

        # Handle alert
        alert = wait.until(EC.alert_is_present())
        alert_text = alert.text
        if not alert:
            print("No alert appeared!")
        else:
            print(f"Alert appeared: {alert_text}")
        alert.accept()
        print("✅ Alert accepted")

    except Exception as e:
        print(f"Bike sell test failed: {e}")


# Run all tests
def run_all_tests():
    test_admin_login()
    test_bike_inventory()
    test_bike_view_details()
    test_bike_add()
    test_bike_edit()
    test_bike_delete()
    test_bike_report()
    test_bike_sell()

run_all_tests()

# Close the WebDriver
driver.quit()