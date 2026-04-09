import tkinter as tk
from tkinter import filedialog, messagebox, ttk
import pandas as pd
import os
import re

# Set a dark color scheme
BG_COLOR = "#2D2D2D"
FG_COLOR = "#FFFFFF"
BUTTON_BG = "#555555"
BUTTON_FG = "#FFFFFF"
SUCCESS_COLOR = "#4CAF50" # Green for success
ERROR_COLOR = "#F04747" # Red for errors
ACCENT_COLOR = "#0078D7" # A modern blue for the main button
PATH_BOX_BG = "#FFFFFF" # White background for path boxes
PATH_BOX_FG = "#000000" # Black color for path text

# The core logic to rename files and update the CSV
def rename_and_update():
    """Reads the CSV, renames files, and updates the CSV file."""
    image_folder = image_folder_path.get()
    csv_file = csv_file_path.get()
    
    if not image_folder or not os.path.isdir(image_folder):
        messagebox.showerror("Error", "Please select a valid image folder.")
        return
    
    if not csv_file or not os.path.exists(csv_file):
        messagebox.showerror("Error", "Please select a valid CSV file.")
        return

    try:
        df = pd.read_csv(csv_file)
        total_files = len(df)
        renamed_count = 0
        
        status_label.config(text="CSV file loaded successfully. Starting renaming process...", fg="yellow")
        
        # Create and display the progress bar
        progress_bar = ttk.Progressbar(frame, orient="horizontal", length=300, mode="determinate")
        progress_bar.pack(pady=10)
        
        illegal_chars = r'[<>:"/\\|?*]'

        for index, row in df.iterrows():
            original_name = str(row["Filename"])
            new_name = str(row["Title"])

            new_name_sanitized = re.sub(illegal_chars, '', new_name)
            new_name_sanitized = new_name_sanitized.replace("..", "_")

            file_extension = os.path.splitext(original_name)[1]
            
            new_physical_name = new_name_sanitized + file_extension
            new_csv_name = new_name_sanitized + ".eps"
            
            original_path = os.path.join(image_folder, original_name)
            new_path = os.path.join(image_folder, new_physical_name)

            status_label.config(text=f"Processing file {index + 1} of {total_files}: {original_name}", fg="yellow")
            root.update_idletasks()
            progress_bar['value'] = (index + 1) / total_files * 100

            if os.path.exists(original_path):
                try:
                    os.rename(original_path, new_path)
                    print(f"Renamed '{original_name}' to '{new_physical_name}'.")
                    df.at[index, 'New Filename'] = new_csv_name
                    renamed_count += 1
                except Exception as e:
                    messagebox.showerror("Error", f"An error occurred while renaming '{original_name}': {e}")
                    status_label.config(text="An error occurred. Check the error message.", fg=ERROR_COLOR)
                    progress_bar.destroy()
                    return
            else:
                messagebox.showerror("File Not Found", f"The file '{original_name}' could not be found in the selected folder. Please check your CSV and folder contents.")
                status_label.config(text="Renaming failed. File not found.", fg=ERROR_COLOR)
                progress_bar.destroy()
                return

        df.to_csv(csv_file, index=False)
        progress_bar.destroy()
        
        status_message = f"Successfully renamed {renamed_count} out of {total_files} files and updated the CSV file."
        status_label.config(text=status_message, fg=SUCCESS_COLOR)
        messagebox.showinfo("Complete", status_message)
        
    except Exception as e:
        messagebox.showerror("Error", f"An unexpected error occurred: {e}")
        status_label.config(text="An unexpected error occurred. See message for details.", fg=ERROR_COLOR)
        try:
            progress_bar.destroy()
        except:
            pass

# tkinter UI design
root = tk.Tk()
root.title("Smart Name Changer")
root.geometry("600x350")
root.resizable(False, False)
root.config(bg=BG_COLOR)

frame = tk.Frame(root, padx=10, pady=10, bg=BG_COLOR)
frame.pack(expand=True)

image_folder_path = tk.StringVar()
csv_file_path = tk.StringVar()

# Folder selection
tk.Label(frame, text="Select Image Folder:", font=("Helvetica", 12), bg=BG_COLOR, fg=FG_COLOR).pack(pady=5)
tk.Entry(frame, textvariable=image_folder_path, width=70, state="readonly", bg=PATH_BOX_BG, fg=PATH_BOX_FG, insertbackground=PATH_BOX_FG).pack(pady=5)
tk.Button(frame, text="Browse Folder", command=lambda: image_folder_path.set(filedialog.askdirectory(title="Select Image Folder")), bg=BUTTON_BG, fg=BUTTON_FG).pack(pady=5)

# CSV file selection
tk.Label(frame, text="Select CSV File:", font=("Helvetica", 12), bg=BG_COLOR, fg=FG_COLOR).pack(pady=5)
tk.Entry(frame, textvariable=csv_file_path, width=70, state="readonly", bg=PATH_BOX_BG, fg=PATH_BOX_FG, insertbackground=PATH_BOX_FG).pack(pady=5)
tk.Button(frame, text="Browse CSV File", command=lambda: csv_file_path.set(filedialog.askopenfilename(title="Select CSV File", filetypes=[("CSV files", "*.csv")])), bg=BUTTON_BG, fg=BUTTON_FG).pack(pady=5)

# Action button
tk.Button(frame, text="Change Names", font=("Helvetica", 12, "bold"), bg=ACCENT_COLOR, fg="white", command=rename_and_update).pack(pady=15)

# Status label
status_label = tk.Label(root, text="Ready, waiting...", font=("Helvetica", 10), bg=BG_COLOR, fg=FG_COLOR)
status_label.pack(pady=10)

# Developer credit
developer_label = tk.Label(root, text="Developed by Mostafizar", font=("Helvetica", 8), bg=BG_COLOR, fg="gray")
developer_label.pack(side="bottom", pady=5)

# এই লাইনটি যোগ করুন
root.mainloop()