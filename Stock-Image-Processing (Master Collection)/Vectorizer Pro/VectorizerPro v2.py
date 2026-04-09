import os
import sys
import time
import threading
import tkinter as tk
from tkinter import messagebox, filedialog, ttk
from tkinter import font as tkfont
import shutil
from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeoutError

# --- Core Paths ---
input_folder = os.path.join(os.getcwd(), 'input')
output_folder = os.path.join(os.getcwd(), 'output')
session_path = os.path.join(os.getcwd(), 'session.json')

# যে ফাইলগুলো স্কিপ করতে চান, তাদের নাম এখানে লিখুন।
# যেমন: files_to_skip = ["problem_image1.png", "another_image.jpg"]
files_to_skip = []

# --- Main Application Class with GUI ---
class VectorizerProApp:
    def __init__(self, master):
        self.master = master
        self.master.title("Vectorizer Pro")
        self.master.geometry("550x400")
        self.master.resizable(False, False)
        self.master.configure(bg="#2b2b2b")

        self.title_font = tkfont.Font(family="Arial", size=24, weight="bold")
        self.label_font = tkfont.Font(family="Arial", size=10)
        self.path_font = tkfont.Font(family="Courier New", size=9)

        style = ttk.Style()
        style.theme_use('clam')
        style.configure("TProgressbar", thickness=15, troughcolor="#4a4a4a", background="#4a90e2")
        
        self.title_frame = tk.Frame(master, bg="#2b2b2b")
        self.title_frame.pack(pady=10)
        self.title_label_part1 = tk.Label(self.title_frame, text="Vectorizer", font=self.title_font, fg="#4a90e2", bg="#2b2b2b")
        self.title_label_part1.pack(side="left")
        self.title_label_part2 = tk.Label(self.title_frame, text="Pro", font=self.title_font, fg="#8b57b7", bg="#2b2b2b")
        self.title_label_part2.pack(side="left")

        self.folder_frame = tk.Frame(master, bg="#2b2b2b")
        self.folder_frame.pack(pady=10)
        
        self.btn_input_folder = tk.Button(self.folder_frame, text="Select Input Folder", command=self.select_input_folder, width=20, bg="#4a4a4a", fg="white", activebackground="#6a6a6a")
        self.btn_input_folder.grid(row=0, column=0, padx=5, pady=5)
        self.input_path_label = tk.Label(self.folder_frame, text=input_folder, font=self.path_font, bg="#3c3c3c", fg="white", relief="sunken", width=35, anchor="w")
        self.input_path_label.grid(row=0, column=1, padx=5, pady=5)

        self.btn_output_folder = tk.Button(self.folder_frame, text="Select Output Folder", command=self.select_output_folder, width=20, bg="#4a4a4a", fg="white", activebackground="#6a6a6a")
        self.btn_output_folder.grid(row=1, column=0, padx=5, pady=5)
        self.output_path_label = tk.Label(self.folder_frame, text=output_folder, font=self.path_font, bg="#3c3c3c", fg="white", relief="sunken", width=35, anchor="w")
        self.output_path_label.grid(row=1, column=1, padx=5, pady=5)

        self.status_frame = tk.Frame(master, bg="#2b2b2b")
        self.status_frame.pack(pady=10)
        
        self.status_circle = tk.Canvas(self.status_frame, width=15, height=15, bg="#2b2b2b", highlightthickness=0)
        self.status_circle.pack(side="left", padx=5)
        self.status_circle.create_oval(3, 3, 12, 12, fill="#8b8b8b", outline="")
        
        self.status_label = tk.Label(self.status_frame, text="Ready", font=self.label_font, bg="#2b2b2b", fg="white")
        self.status_label.pack(side="left", padx=5)
        
        self.progress_bar = ttk.Progressbar(master, orient="horizontal", length=400, mode="determinate")
        self.progress_bar.pack(pady=5)
        
        self.live_status_label = tk.Label(master, text="", font=self.label_font, bg="#2b2b2b", fg="#cccccc")
        self.live_status_label.pack(pady=2)

        self.check_session_status()

        self.action_frame = tk.Frame(master, bg="#2b2b2b")
        self.action_frame.pack(pady=5)
        
        self.btn_save = tk.Button(self.action_frame, text="1. Save Session", command=self.start_thread_save, width=15, bg="#4a4a4a", fg="white", activebackground="#6a6a6a")
        self.btn_save.grid(row=0, column=0, padx=5)

        self.btn_main = tk.Button(self.action_frame, text="2. Process Images", command=self.start_thread_process, width=15, bg="#4a4a4a", fg="white", activebackground="#6a6a6a")
        self.btn_main.grid(row=0, column=1, padx=5)
        
        self.btn_help = tk.Button(self.action_frame, text="Help", command=self.show_help, width=15, bg="#4a4a4a", fg="white", activebackground="#6a6a6a")
        self.btn_help.grid(row=0, column=2, padx=5)
        
        self.copyright_frame = tk.Frame(master, bg="#2b2b2b")
        self.copyright_frame.pack(side="bottom", pady=10)
        self.copyright_label1 = tk.Label(self.copyright_frame, text="© 2025 Vectorizer Pro. All rights reserved.\nDeveloped by:", font=self.label_font, bg="#2b2b2b", fg="#cccccc")
        self.copyright_label1.pack()
        self.developed_by_label = tk.Label(self.copyright_frame, text="Mostafizar Rahman", font=self.label_font, fg="#4a90e2", bg="#2b2b2b", cursor="hand2")
        self.developed_by_label.pack()
        self.developed_by_label.bind("<Button-1>", lambda e: self.open_link("https://t.me/mostafizarfiz"))

    def select_input_folder(self):
        folder_selected = filedialog.askdirectory()
        if folder_selected:
            self.input_path_label.config(text=folder_selected)
            global input_folder
            input_folder = folder_selected

    def select_output_folder(self):
        folder_selected = filedialog.askdirectory()
        if folder_selected:
            self.output_path_label.config(text=folder_selected)
            global output_folder
            output_folder = folder_selected

    def check_session_status(self):
        if not os.path.exists(session_path):
            self.status_label.config(text="Session file not found! Please save the session first.", fg="#ff6347")
            self.status_circle.itemconfig(1, fill="#ff6347")
        else:
            self.status_label.config(text="Session file found. Ready to process images.", fg="#8bc34a")
            self.status_circle.itemconfig(1, fill="#8bc34a")

    def log(self, message, color="white"):
        self.status_label.config(text=f"{message}", fg=color)
        if "✅" in message:
            self.status_circle.itemconfig(1, fill="#8bc34a")
        elif "❌" in message:
            self.status_circle.itemconfig(1, fill="#ff6347")
        else:
            self.status_circle.itemconfig(1, fill="white")
        self.master.update_idletasks()

    def update_live_status(self, current, total):
        self.live_status_label.config(text=f"Processing {current}/{total} images...")
        self.master.update_idletasks()

    def show_help(self):
        help_text = """
        How to use this tool:

        Step 1: Save Session
        Click the 'Save Session' button. A browser will open. Manually log in to your account. After logging in, close the browser. Your session will be saved for future use. This is a one-time step.

        Step 2: Process Images
        Put all the JPG, JPEG, and PNG images you want to process into the 'input' folder. The folder path can be changed using the 'Select Input Folder' button.

        Step 3: Run
        Click the 'Process Images' button. The script will automatically process and download the EPS files into the 'output' folder.
        """
        messagebox.showinfo("Help", help_text)

    def open_link(self, url):
        import webbrowser
        webbrowser.open_new(url)

    def start_thread_save(self):
        thread = threading.Thread(target=self.run_save_session)
        thread.daemon = True
        thread.start()

    def run_save_session(self):
        self.log("Saving session...", "#4a90e2")
        try:
            with sync_playwright() as p:
                browser = p.chromium.launch(headless=False)
                context = browser.new_context()
                page = context.new_page()
                page.goto("https://vectorizer.ai/")
                self.log("Please log in and close the browser to save the session.", "#fff")
                page.wait_for_event('close')
                context.storage_state(path=session_path)
                browser.close()
            self.log("✅ Session saved successfully!", "#8bc34a")
            messagebox.showinfo("Success!", "Session file has been saved. You can now process images.")
        except Exception as e:
            self.log(f"❌ Error: {e}", "#ff6347")

    def start_thread_process(self):
        thread = threading.Thread(target=self.run_main_process)
        thread.daemon = True
        thread.start()

    def run_main_process(self):
        self.log("Processing images...", "#4a90e2")
        if not os.path.exists(input_folder) or not os.path.exists(output_folder):
            self.log("❌ Error: 'input' or 'output' folder not found!", "#ff6347")
            return
        if not os.path.exists(session_path):
            self.log("❌ Error: Session file not found! Please save the session first.", "#ff6347")
            return
        
        # সফল এবং ব্যর্থ ফাইল রাখার জন্য ফোল্ডারগুলো ইনপুট ফোল্ডারের ভেতরে তৈরি করা হচ্ছে
        done_folder = os.path.join(input_folder, 'Done EPS')
        error_folder = os.path.join(input_folder, 'Error EPS')
        os.makedirs(done_folder, exist_ok=True)
        os.makedirs(error_folder, exist_ok=True)

        all_files = [f for f in os.listdir(input_folder) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
        # নির্দিষ্ট ফাইল স্কিপ করা
        files_to_process = [f for f in all_files if f not in files_to_skip]

        if not files_to_process:
            self.log("❌ Error: No images to process. Check your input folder or files_to_skip list.", "#ff6347")
            return
        
        total_images = len(files_to_process)
        successful_images = 0
        self.log(f"Found {total_images} images to process.", "#8bc34a")
        if files_to_skip:
            self.log(f"Skipping {len(files_to_skip)} files as requested.", "#ff6347")

        with sync_playwright() as p:
            browser = p.chromium.launch(headless=False)
            context = browser.new_context(storage_state=session_path, accept_downloads=True)
            
            for i, file in enumerate(files_to_process):
                file_path = os.path.join(input_folder, file)
                retry_count = 0
                max_retries = 2 # ২ বার চেষ্টা করার জন্য পরিবর্তন করা হয়েছে
                
                while retry_count < max_retries:
                    page = None
                    try:
                        self.update_live_status(i + 1, total_images)
                        self.progress_bar["value"] = (i / total_images) * 100
                        
                        page = context.new_page()
                        page.goto("https://vectorizer.ai/")
                        
                        # Wait for the upload button to be ready before clicking
                        page.wait_for_selector("button.FileInput-click_to_upload", state="visible", timeout=300000)
                        
                        with page.expect_file_chooser() as fc_info:
                            page.locator("button.FileInput-click_to_upload").click()
                        file_chooser = fc_info.value
                        file_chooser.set_files(file_path)
                        
                        # Wait for the OK button to be visible and ready for click
                        ok_button_selector = "button.PreCrop-Sidebar-crop_button"
                        page.wait_for_selector(ok_button_selector, state="visible", timeout=300000)
                        page.click(ok_button_selector)
                        
                        # Wait for the first download link to appear
                        first_download_link_selector = 'a#App-DownloadLink'
                        page.wait_for_selector(first_download_link_selector, state="visible", timeout=300000)
                        page.click(first_download_link_selector)
                        
                        # Wait for EPS and Fine options to appear and be ready
                        page.wait_for_selector('label:has-text("EPS")', state="visible", timeout=300000)
                        page.click('label:has-text("EPS")')
                        page.wait_for_selector('label:has-text("Fine")', state="visible", timeout=300000)
                        page.click('label:has-text("Fine")')
                        
                        # Wait for final download button to be ready
                        final_download_button_selector = '#Options-Submit'
                        page.wait_for_selector(final_download_button_selector, state="visible", timeout=300000)
                        
                        with page.expect_download() as download_info:
                            page.click(final_download_button_selector)
                        
                        download = download_info.value
                        download.save_as(os.path.join(output_folder, download.suggested_filename))
                        
                        page.close()
                        successful_images += 1
                        self.log(f"✅ Success: {os.path.basename(file_path)}", "#8bc34a")
                        
                        # সফল হলে ইনপুট ফাইলটিকে Done EPS ফোল্ডারে সরানো হচ্ছে
                        shutil.move(file_path, os.path.join(done_folder, file))
                        
                        break # সফল হলে লুপ থেকে বেরিয়ে যাবে
                        
                    except PlaywrightTimeoutError as te:
                        retry_count += 1
                        self.log(f"❌ Timeout for {os.path.basename(file_path)}: {te} | Retrying ({retry_count}/{max_retries})...", "#ff6347")
                        if page and not page.is_closed():
                            page.close()
                        if retry_count >= max_retries:
                            self.log(f"❌ Skipped {os.path.basename(file_path)} after {max_retries} retries.", "#ff6347")
                            # ব্যর্থ হলে ইনপুট ফাইলটিকে Error EPS ফোল্ডারে সরানো হচ্ছে
                            shutil.move(file_path, os.path.join(error_folder, file))
                            break
                    except Exception as e:
                        retry_count += 1
                        self.log(f"❌ Error for {os.path.basename(file_path)}: {e} | Retrying ({retry_count}/{max_retries})...", "#ff6347")
                        if page and not page.is_closed():
                            page.close()
                        if retry_count >= max_retries:
                            self.log(f"❌ Skipped {os.path.basename(file_path)} after {max_retries} retries.", "#ff6347")
                            # ব্যর্থ হলে ইনপুট ফাইলটিকে Error EPS ফোল্ডারে সরানো হচ্ছে
                            shutil.move(file_path, os.path.join(error_folder, file))
                            break

            self.progress_bar["value"] = 100
            browser.close()
            self.log(f"🎉 Process done! {successful_images}/{total_images} images successful.", "#8bc34a")
            self.live_status_label.config(text="")
            
def run_app():
    root = tk.Tk()
    app = VectorizerProApp(root)
    root.mainloop()

if __name__ == "__main__":
    run_app()