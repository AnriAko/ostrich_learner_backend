To generate `.exe` files from Python scripts, first install Python and all the required libraries:

```bash
pip install pyinstaller pymupdf pdfplumber pymongo pillow
```

Optionally, install [UPX](https://upx.github.io/) to reduce the final file size.
If not using it just remove --upx-dir "C:/PathToUPX" flag in a command where "C:/PathToUPX" is a path to unpacked upx.exe file.

### Command for generating ".exe" file:

```bash
pyinstaller --onefile --upx-dir "C:/PathToUPX" pdf_to_json_stream.py
```

> 💡 Make sure the `upx` binary is executable (`chmod +x /path/to/upx`) and that `pyinstaller` is installed (`pip install pyinstaller`).
